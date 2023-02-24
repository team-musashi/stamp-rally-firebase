import { EntrySpot } from './../../firestore-collection/entry-stamp-rally/entity/entrySpot'
import { EntryStampRally } from './../../firestore-collection/entry-stamp-rally/entity/entryStampRally'
import { commandConverter } from './../../firestore-collection/command/commandConverter'
import { constants } from '../../config/constants'
import 'reflect-metadata'
import * as functions from 'firebase-functions'
import * as googleMaps from '@google/maps'
import { PublicStampRallyRepository } from '../../firestore-collection/public-stamp-rally/publicStampRallyRepository'
import { container, providers } from '../../config/dicon'
import { UserRepository } from '../../firestore-collection/user/userRepository'
import { Command } from '../../firestore-collection/command/entity/command'
import { LatLng } from '@google/maps'
import { TravelMode, TravelRestriction } from '@googlemaps/google-maps-services-js'
import { GeoPoint } from 'firebase-admin/firestore'

/**
 * コマンドが作成された
 */
export const onCreateCommand = functions
  .region(constants.region)
  .runWith({ secrets: [`GOOGLE_MAP_API_KEY`] })
  .firestore.document(`/command/{id}`)
  .onCreate(async (snapshot) => {
    const command = commandConverter.fromFirestore(snapshot)
    functions.logger.info(`id = ${command.id}`)
    functions.logger.info(`uid = ${command.uid}`)
    functions.logger.info(`commandType = ${command.commandType}`)
    functions.logger.info(command.data)

    // コマンドとしてデータ不正なら処理終了
    if (!command.uid || !command.commandType || !command.createdAt) {
      functions.logger.error(`不正なコマンドデータです: id = ${command.id}`)
      return
    }

    // コマンドタイプによって処理を振り分ける
    switch (command.commandType) {
      case `enterStampRally`:
        await enterStampRally(command)
        break

      case `completeStampRally`:
        await completeStampRally(command)
        break

      case `withdrawStampRally`:
        await withdrawStampRally(command)
        break

      case `calculateRoute`:
        await calculateRoute(command)
        break

      default:
        functions.logger.error(`不正なコマンドタイプです: commandType = ${command.commandType}`)
        break
    }
  })

/**
 * スタンプラリーに参加する
 */
const enterStampRally = async (command: Command) => {
  if (!command.uid) {
    functions.logger.error(`ユーザーIDがありません`)
    return
  }

  const stampRallyId = command.data?.get(`stampRallyId`) as string
  if (!stampRallyId) {
    functions.logger.error(`スタンプラリーIDがありません`)
    return
  }

  functions.logger.info(`公開スタンプラリーを取得する: publicStampRallyId = ${stampRallyId}`)
  const publicStampRallyRepository = container.get<PublicStampRallyRepository>(providers.publicStampRallyRepository)
  const publicStampRally = await publicStampRallyRepository.get({ id: stampRallyId })
  if (!publicStampRally) {
    functions.logger.error(`公開スタンプラリーが見つかりません: publicStampRallyId = ${stampRallyId}`)
    return
  }
  functions.logger.info(`公開スポットリストを取得する: publicStampRallyId = ${stampRallyId}`)
  const publicSpots = await publicStampRallyRepository.getSpots({ id: stampRallyId })
  if (publicSpots.length == 0) {
    functions.logger.warn(`スポットが0件です: publicStampRallyId = ${stampRallyId}`)
  }

  functions.logger.info(`公開スタンプラリーから参加スタンプラリーに変換する`)
  const entryStampRally = EntryStampRally.fromPublicStampRally(publicStampRally)
  const entrySpots = publicSpots.map((publicSpot) => {
    return EntrySpot.fromPublicSpot(publicSpot)
  })

  functions.logger.info(`スタンプラリーとスポットリストをユーザー配下に追加する`)
  const userRepository = container.get<UserRepository>(providers.userRepository)
  await userRepository.enterStampRally({
    uid: command.uid,
    stampRally: entryStampRally,
    spots: entrySpots,
  })
  functions.logger.info(
    `スタンプラリーとスポットリストをユーザー配下に追加しました: uid = ${command.uid}, publicStampRallyId = ${stampRallyId}`
  )
}

/**
 * 参加中スタンプラリーを完了する
 */
const completeStampRally = async (command: Command) => {
  if (!command.uid) {
    functions.logger.error(`ユーザーIDがありません`)
    return
  }

  const stampRallyId = command.data?.get(`stampRallyId`) as string
  if (!stampRallyId) {
    functions.logger.error(`スタンプラリーIDがありません`)
    return
  }

  functions.logger.info(`参加中スタンプラリーを完了ステータスに変換する`)
  const userRepository = container.get<UserRepository>(providers.userRepository)
  await userRepository.completeStampRally({
    uid: command.uid,
    entryStampId: stampRallyId,
  })
  functions.logger.info(`参加中スタンプラリーを完了ステータスに変換しました`)
}

/**
 * 参加中スタンプラリーを中断する
 */
const withdrawStampRally = async (command: Command) => {
  if (!command.uid) {
    functions.logger.error(`ユーザーIDがありません`)
    return
  }

  const stampRallyId = command.data?.get(`stampRallyId`) as string
  if (!stampRallyId) {
    functions.logger.error(`スタンプラリーIDがありません`)
    return
  }

  functions.logger.info(`参加中スタンプラリーを中断ステータスに変換する`)
  const userRepository = container.get<UserRepository>(providers.userRepository)
  await userRepository.withdrawStampRally({
    uid: command.uid,
    entryStampId: stampRallyId,
  })
  functions.logger.info(`参加中スタンプラリーを中断ステータスに変換しました`)
}

/**
 * スタンプラリースポットの経路を算出する
 */
const calculateRoute = async (command: Command) => {
  // ユーザーIDがなければ処理終了
  if (!command.uid) {
    functions.logger.error(`ユーザーIDがありません`)
    return
  }

  // コマンドからスタンプラリーIDが取得できなければ処理終了
  const stampRallyId = command.data?.get(`stampRallyId`) as string
  if (!stampRallyId) {
    functions.logger.error(`スタンプラリーIDがありません`)
    return
  }

  // SecretManagerからGoogle Map APIのAPIキーが取得できなければ処理終了
  const apiKey = process.env.GOOGLE_MAP_API as string
  if (!apiKey) {
    functions.logger.error(`Google Map API の API キーがありません`)
    return
  }

  // 公開スタンプラリーが取得できなければ処理終了
  const publicStampRallyRepository = container.get<PublicStampRallyRepository>(providers.publicStampRallyRepository)
  const publicStampRally = await publicStampRallyRepository.get({ id: stampRallyId })
  if (!publicStampRally) {
    functions.logger.error(`公開スタンプラリーが見つかりません: publicStampRallyId = ${stampRallyId}`)
    return
  }

  // 公開スタンプラリー中の公開スポットが取得できなければ処理終了
  const publicSpots = await publicStampRallyRepository.getSpots({ id: stampRallyId })
  if (publicSpots.length == 0) {
    functions.logger.warn(`スポットが0件です: publicStampRallyId = ${stampRallyId}`)
    return
  }

  // Google Map APIサービスの初期化
  const mapClient = googleMaps.createClient({ key: apiKey })

  // 該当スタンプラリー中の全スポット間の経路を求める
  let stampRallyRoute: GeoPoint[] = []
  for await (const [i, spot] of publicSpots.entries()) {
    if (i == publicSpots.length - 1) {
      break
    }
    if (!publicSpots[i].location || !publicSpots[i + 1].location) {
      continue
    }

    // 経路算出開始スポットの座標
    const from: LatLng = {
      latitude: (spot.location! as any as GeoPoint).latitude,
      longitude: (spot.location! as any as GeoPoint).longitude,
    }

    // 経路算出終了スポットの座標
    const to: LatLng = {
      latitude: (publicSpots[i + 1].location! as any as GeoPoint).latitude,
      longitude: (publicSpots[i + 1].location! as any as GeoPoint).longitude,
    }

    // Directions APIを使用して2点間の経路を算出
    //
    const steps = await getDirections(mapClient, from, to)
    for (let i = 0; i < steps.length; i++) {
      if (i == 0) {
        // 1つ目のみ開始位置、終了位置の両方を取り出す
        stampRallyRoute.push(new GeoPoint(steps[i].start_location.lat, steps[i].start_location.lng))
      }
      // 2回目以降は終了位置のみ取り出す（1つ目の終了位置 = 2つ目の開始位置、2つ目の終了位置 = 3つ目の開始位置 となるため）
      stampRallyRoute.push(new GeoPoint(steps[i].end_location.lat, steps[i].end_location.lng))
    }
  }

  // 公開中スタンプラリーの経路情報として更新
  publicStampRally.route = stampRallyRoute
  await publicStampRallyRepository.update({ publicStampRally: publicStampRally })
  functions.logger.info(`スタンプラリースポットの経路算出が完了しました`)
}

/// Google Maps API の Directions API（経路算出）を呼び出す
/// param: 1. GoogleMapsAPIを叩くためのサービス, 2. 開始経路, 3.終了経路
async function getDirections(
  mapClient: googleMaps.GoogleMapsClient,
  from: LatLng,
  to: LatLng
): Promise<googleMaps.DirectionsStep[]> {
  return new Promise<googleMaps.DirectionsStep[]>((resolve, reject) => {
    // 経路算出（Directions）API呼び出し
    // 徒歩モードで算出
    mapClient.directions(
      {
        origin: from,
        destination: to,
        mode: TravelMode.walking,
        avoid: [TravelRestriction.highways, TravelRestriction.tolls, TravelRestriction.ferries],
      },
      (error, response) => {
        // コールバック処理にてAPIレスポンスを受け取る
        if (error) {
          // APIレスポンスを受け取れなかった
          reject(error)
        } else {
          // APIレスポンスを受け取った
          // json.stepsタグの中には2点間の経路を表現するために直線の情報をいくつも保持している
          //  → いくつかある直線情報を元にして、2点間の経路を表現するための曲線を表現するイメージ
          resolve(response.json.routes[0].legs[0].steps)
        }
      }
    )
  })
}
