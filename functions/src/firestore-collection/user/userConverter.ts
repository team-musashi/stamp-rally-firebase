import { User } from './entity/user'
import { FieldValue, FirestoreDataConverter } from 'firebase-admin/firestore'

export const userConverter: FirestoreDataConverter<User> = {
  fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot): User {
    const data = snapshot.data()
    return {
      uid: snapshot.id,
      authProvider: data.authProvider ?? `anonymous`,
      platform: data.platform,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    }
  },
  toFirestore(user: User): FirebaseFirestore.DocumentData {
    return {
      authProvider: user.authProvider,
      platform: user.platform,
      createdAt: user.createdAt ? FieldValue.serverTimestamp() : undefined,
      updatedAt: FieldValue.serverTimestamp(),
    }
  },
}
