import { constants } from '~/src/config/constants'
import 'reflect-metadata'
import * as functions from 'firebase-functions'
import { StampRallyRepository } from '../../firestore-collection/stamp-rally/stampRallyRepository'
import { container, providers } from '~/src/config/dicon'
import { UserRepository } from '~/src/firestore-collection/user/userRepository'

export const onCreateEvent = functions
  .region(constants.region)
  .firestore.document(`/event/{eventId}`)
  .onCreate(async (snapshot, _) => {
    const stampRallyId: string = snapshot.data()[`data`].value
    functions.logger.info(`スタンプラリーIDを取得しました: uid = ${stampRallyId}`)

    const stampRallyRepository = container.get<StampRallyRepository>(providers.stampRallyRepository)
    const stampRally = await stampRallyRepository.get({ inputKey: stampRallyId })

    const userRepository = container.get<UserRepository>(providers.userRepository)
    await userRepository.addEntryStampRally({ inputKey: snapshot.data()[`uid`], inputValue: stampRally })
  })
