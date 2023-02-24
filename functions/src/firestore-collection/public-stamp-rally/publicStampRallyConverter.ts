import { PublicStampRally } from './entity/publicStampRally'
import { FieldValue, FirestoreDataConverter } from 'firebase-admin/firestore'

export const publicStampRallyConverter: FirestoreDataConverter<PublicStampRally> = {
  fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot): PublicStampRally {
    const data = snapshot.data()
    return {
      id: snapshot.id,
      title: data.title,
      summary: data.summary,
      area: data.area,
      requiredTime: data.requiredTime,
      imageUrl: data.imageUrl,
      startDate: data.startDate,
      endDate: data.endDate,
      route: data.route,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    }
  },
  toFirestore(stampRally: PublicStampRally): FirebaseFirestore.DocumentData {
    return {
      title: stampRally.title,
      summary: stampRally.summary,
      area: stampRally.area,
      requiredTime: stampRally.requiredTime,
      imageUrl: stampRally.imageUrl,
      startDate: stampRally.startDate,
      endDate: stampRally.endDate,
      route: stampRally.route,
      createdAt: stampRally.createdAt ? FieldValue.serverTimestamp() : undefined,
      updatedAt: FieldValue.serverTimestamp(),
    }
  },
}
