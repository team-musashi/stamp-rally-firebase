import { User } from './entity/user'
import { FieldValue, FirestoreDataConverter } from 'firebase-admin/firestore'

export const userConverter: FirestoreDataConverter<User> = {
  fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot): User {
    const data = snapshot.data()
    return {
      uid: snapshot.id,
      provider: data.provider ?? `anonymous`,
      createdPlatform: data.createdPlatform,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    }
  },
  toFirestore(user: User): FirebaseFirestore.DocumentData {
    return {
      provider: user.provider,
      createdPlatform: user.createdPlatform,
      createdAt: user.createdAt ? FieldValue.serverTimestamp() : undefined,
      updatedAt: FieldValue.serverTimestamp(),
    }
  },
}
