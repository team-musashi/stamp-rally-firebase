import 'reflect-metadata'
import * as functions from 'firebase-functions'
import { constants } from '../../config/constants'
import { User } from '../../firestore-collection/user/entity/user'
import { container, providers } from '../../config/dicon'
import { UserRepository } from '../../firestore-collection/user/userRepository'

/**
 * 認証ユーザーが作成されたらユーザードキュメントを追加する
 */
export const onCreateAuthUser = functions
  .region(constants.region)
  .auth.user()
  .onCreate(async (user) => {
    const input = new User({
      uid: user.uid,
      /** 匿名ユーザー固定、今後認証プロバイダーを追加したら変更が必要です  */
      provider: `anonymous`,
    })

    const userRepository = container.get<UserRepository>(providers.userRepository)
    await userRepository.add({ input: input })
    functions.logger.info(`ユーザーを追加しました: uid = ${input.uid}`)
  })
