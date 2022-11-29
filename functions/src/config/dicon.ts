import 'reflect-metadata'
import { Container } from 'inversify/lib/container/container'
import { Firestore } from 'firebase-admin/firestore'
import * as admin from 'firebase-admin'
import { User } from '../firestore-collection/user/entity/user'
import { Event } from '../firestore-collection/event/entity/event'
import { StampRally } from '../firestore-collection/stamp-rally/entity/stampRally'
import { userConverter } from '../firestore-collection/user/userConverter'
import { eventConverter } from '../firestore-collection/event/eventConverter'
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
   * Event
   */
  eventRef: Symbol.for(`eventRef`),
  eventRepository: Symbol.for(`eventRepository`),

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
 * Event
 */
container
  .bind<FirebaseFirestore.CollectionReference<Event>>(providers.eventRef)
  .toDynamicValue((context) => {
    const db = context.container.get<Firestore>(providers.firestoreDb)
    return db.collection(`event`).withConverter<Event>(eventConverter)
  })
  .inSingletonScope()

/**
 * StampRally
 */
container
  .bind<FirebaseFirestore.CollectionReference<StampRally>>(providers.stampRallyRef)
  .toDynamicValue((context) => {
    const db = context.container.get<Firestore>(providers.firestoreDb)
    return db.collection(`stampRally`).withConverter<StampRally>(stampRallyConverter)
  })
  .inSingletonScope()
container.bind<StampRallyRepository>(providers.stampRallyRepository).to(StampRallyRepository)
