import { FieldValue, FirestoreDataConverter } from 'firebase-admin/firestore'
import { EntrySpot } from './entity/entrySpot'

export const entrySpotConverter: FirestoreDataConverter<EntrySpot> = {
  fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot): EntrySpot {
    const data = snapshot.data()
    return {
      id: snapshot.id,
      order: data.order,
      title: data.title,
      summary: data.summary,
      address: data.address,
      tel: data.tel,
      imageUrl: data.imageUrl,
      location: data.location,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
      publicSpotId: data.publicSpotId,
      gotDate: data.gotDate,
    }
  },
  toFirestore(spot: EntrySpot): FirebaseFirestore.DocumentData {
    return {
      order: spot.order,
      title: spot.title,
      summary: spot.summary,
      address: spot.address,
      tel: spot.tel,
      imageUrl: spot.imageUrl,
      location: spot.location,
      createdAt: spot.createdAt ? FieldValue.serverTimestamp() : undefined,
      updatedAt: FieldValue.serverTimestamp(),
      publicSpotId: spot.publicSpotId,
      gotDate: spot.gotDate,
    }
  },
}
