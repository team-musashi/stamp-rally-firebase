import { StampRally } from '../stamp-rally/entity/stampRally'
import { FieldValue, FirestoreDataConverter } from 'firebase-admin/firestore'

export const stampRallyConverter: FirestoreDataConverter<StampRally> = {
  fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot): StampRally {
    const data = snapshot.data()
    return {
      id: snapshot.id,
      title: data.title,
      explanation: data.explanation,
      place: data.place,
      requiredTime: data.requiredTime,
      imageUrl: data.imageUrl,
      startDate: data.startDate,
      endDate: data.endDate,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    }
  },
  toFirestore(stampRally: StampRally): FirebaseFirestore.DocumentData {
    return {
      title: stampRally.title,
      explanation: stampRally.explanation,
      place: stampRally.place,
      requiredTime: stampRally.requiredTime,
      imageUrl: stampRally.imageUrl,
      startDate: stampRally.startDate,
      endDate: stampRally.endDate,
      createdAt: stampRally.createdAt ? FieldValue.serverTimestamp() : undefined,
      updatedAt: FieldValue.serverTimestamp(),
    }
  },
}
