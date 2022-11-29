import { StampRally } from '../stamp-rally/entity/stampRally'
import { FirestoreDataConverter } from 'firebase-admin/firestore'

export const stampRallyConverter: FirestoreDataConverter<StampRally> = {
  fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot): StampRally {
    const data = snapshot.data()
    return {
      title: data.title,
      explanation: data.explanation,
      place: data.place,
      requiredTime: data.requiredTime,
      imageUrl: data.imageUrl,
      startDate: data.startDate,
      endDate: data.endDate,
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
    }
  },
}
