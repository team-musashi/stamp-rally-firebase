import { FieldValue, FirestoreDataConverter } from 'firebase-admin/firestore'
import { EntryStampRally } from './entity/entryStampRally'

export const entryStampRallyConverter: FirestoreDataConverter<EntryStampRally> = {
  fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot): EntryStampRally {
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
      status: data.status,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
      publicStampRallyId: data.publicStampRallyId,
    }
  },
  toFirestore(stampRally: EntryStampRally): FirebaseFirestore.DocumentData {
    return {
      title: stampRally.title,
      summary: stampRally.summary,
      area: stampRally.area,
      requiredTime: stampRally.requiredTime,
      imageUrl: stampRally.imageUrl,
      startDate: stampRally.startDate,
      endDate: stampRally.endDate,
      route: stampRally.route,
      status: stampRally.status,
      createdAt: stampRally.createdAt ? FieldValue.serverTimestamp() : undefined,
      updatedAt: FieldValue.serverTimestamp(),
      publicStampRallyId: stampRally.publicStampRallyId,
    }
  },
}
