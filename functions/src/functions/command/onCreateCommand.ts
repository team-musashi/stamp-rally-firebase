import { EntrySpot } from './../../firestore-collection/entry-stamp-rally/entity/entrySpot'
import { EntryStampRally } from './../../firestore-collection/entry-stamp-rally/entity/entryStampRally'
import { commandConverter } from './../../firestore-collection/command/commandConverter'
import { constants } from '../../config/constants'
import 'reflect-metadata'
import * as functions from 'firebase-functions'
import { PublicStampRallyRepository } from '../../firestore-collection/public-stamp-rally/publicStampRallyRepository'
import { container, providers } from '../../config/dicon'
import { UserRepository } from '../../firestore-collection/user/userRepository'
import { Command } from '../../firestore-collection/command/entity/command'

/**
 * コマンドが作成された
 */
export const onCreateCommand = functions
  .region(constants.region)
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
      case `entryStampRally`:
        await entryStampRally(command)
        break

      default:
        functions.logger.error(`不正なコマンドタイプです: commandType = ${command.commandType}`)
        break
    }
  })

/**
 * スタンプラリーに参加する
 */
const entryStampRally = async (command: Command) => {
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
  await userRepository.entryStampRally({
    uid: command.uid,
    stampRally: entryStampRally,
    spots: entrySpots,
  })
  functions.logger.info(
    `スタンプラリーとスポットリストをユーザー配下に追加しました: uid = ${command.uid}, publicStampRallyId = ${stampRallyId}`
  )
}
