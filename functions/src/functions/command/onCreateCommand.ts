import { commandConverter } from './../../firestore-collection/command/commandConverter'
import { constants } from '../../config/constants'
import 'reflect-metadata'
import * as functions from 'firebase-functions'
import { StampRallyRepository } from '../../firestore-collection/stamp-rally/stampRallyRepository'
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

    // コマンドとしてデータ不正なら処理終了
    if (!command.uid || !command.commandType || !command.createdAt) {
      functions.logger.error(`不正なコマンドデータです: id = ${command.id}`)
      return
    }

    // コマンドタイプによって処理を振り分ける
    switch (command.commandType) {
      case `entryStampRally`:
        entryStampRally(command)
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

  // スタンプラリーとスポットリストを取得する
  const stampRallyRepository = container.get<StampRallyRepository>(providers.stampRallyRepository)
  const stampRally = await stampRallyRepository.get({ id: stampRallyId })
  if (!stampRally) {
    functions.logger.error(`スタンプラリーが見つかりません: id = ${stampRallyId}`)
    return
  }
  const spots = await stampRallyRepository.getSpots({ id: stampRallyId })
  if (spots.length == 0) {
    functions.logger.warn(`スポットが0件です: id = ${stampRallyId}`)
  }

  // スタンプラリーとスポットリストをユーザー配下に追加する
  const userRepository = container.get<UserRepository>(providers.userRepository)
  await userRepository.addStampRally({
    uid: command.uid,
    stampRally: stampRally,
    spots: spots,
  })
  functions.logger.info(
    `スタンプラリーとスポットリストをユーザー配下に追加しました: uid = ${command.uid}, stampRallyId = ${stampRallyId}`
  )
}
