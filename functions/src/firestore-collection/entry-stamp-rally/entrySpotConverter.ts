import { FieldValue, FirestoreDataConverter } from 'firebase-admin/firestore'
import { EntrySpot } from './entity/entrySpot'

export const entrySpotConverter: FirestoreDataConverter<EntrySpot> = {
  fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot): EntrySpot {
    const data = snapshot.data()
    return {
      id: snapshot.id,
      imageUrl: data.imageUrl,
      order: data.order,
      location: data.location,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
      publicSpotId: data.publicSpotId,
      gotDate: data.gotDate,
    }
  },
  toFirestore(spot: EntrySpot): FirebaseFirestore.DocumentData {
    return {
      imageUrl: spot.imageUrl,
      order: spot.order,
      location: spot.location,
      createdAt: spot.createdAt ? FieldValue.serverTimestamp() : undefined,
      updatedAt: FieldValue.serverTimestamp(),
      publicSpotId: spot.publicSpotId,
      gotDate: spot.gotDate,
    }
  },
}
