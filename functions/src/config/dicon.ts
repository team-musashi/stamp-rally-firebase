import 'reflect-metadata'
import { Container } from 'inversify/lib/container/container'
import { Firestore } from 'firebase-admin/firestore'
import * as admin from 'firebase-admin'
import { User } from '../firestore-collection/user/entity/user'
import { Command } from '../firestore-collection/command/entity/command'
import { StampRally } from '../firestore-collection/stamp-rally/entity/stampRally'
import { userConverter } from '../firestore-collection/user/userConverter'
import { commandConverter } from '../firestore-collection/command/commandConverter'
import { stampRallyConverter } from '../firestore-collection/stamp-rally/stampRallyConverter'
import { UserRepository } from '../firestore-collection/user/userRepository'
import { StampRallyRepository } from '../firestore-collection/stamp-rally/stampRallyRepository'

/**
 * DI コンテナー
 */
export const container = new Container()

/**************************************************************************
 * プロバイダー名の定義
 **************************************************************************/

export const providers = {
  /**
   * Firestore
   */
  firestoreDb: Symbol.for(`firestoreDb`),

  /**
   * User
   */
  userRef: Symbol.for(`userRef`),
  userRepository: Symbol.for(`userRepository`),

  /**
   * Command
   */
  commandRef: Symbol.for(`commandRef`),
  commandRepository: Symbol.for(`commandRepository`),

  /**
   * StampRally
   */
  stampRallyRef: Symbol.for(`stampRallyRef`),
  stampRallyRepository: Symbol.for(`stampRallyRepository`),
}

/**************************************************************************
 * DI の登録
 **************************************************************************/

/**
 * Firestore
 */
container
  .bind<Firestore>(providers.firestoreDb)
  .toDynamicValue(() => {
    const db = admin.firestore()
    /** undefined なプロパティを無視するよう設定する */
    db.settings({ ignoreUndefinedProperties: true })
    return db
  })
  .inSingletonScope()

/**
 * User
 */
container
  .bind<FirebaseFirestore.CollectionReference<User>>(providers.userRef)
  .toDynamicValue((context) => {
    const db = context.container.get<Firestore>(providers.firestoreDb)
    return db.collection(`user`).withConverter<User>(userConverter)
  })
  .inSingletonScope()
container.bind<UserRepository>(providers.userRepository).to(UserRepository)

/**
 * Command
 */
container
  .bind<FirebaseFirestore.CollectionReference<Command>>(providers.commandRef)
  .toDynamicValue((context) => {
    const db = context.container.get<Firestore>(providers.firestoreDb)
    return db.collection(`command`).withConverter<Command>(commandConverter)
  })
  .inSingletonScope()

/**
 * StampRally
 */
container
  .bind<FirebaseFirestore.CollectionReference<StampRally>>(providers.stampRallyRef)
  .toDynamicValue((context) => {
    const db = context.container.get<Firestore>(providers.firestoreDb)
    return db.collection(`publicStampRally`).withConverter<StampRally>(stampRallyConverter)
  })
  .inSingletonScope()
container.bind<StampRallyRepository>(providers.stampRallyRepository).to(StampRallyRepository)
