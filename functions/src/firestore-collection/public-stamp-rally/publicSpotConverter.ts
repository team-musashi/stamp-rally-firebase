import { FieldValue, FirestoreDataConverter } from 'firebase-admin/firestore'
import { PublicSpot } from './entity/publicSpot'

export const publicSpotConverter: FirestoreDataConverter<PublicSpot> = {
  fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot): PublicSpot {
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
    }
  },
  toFirestore(spot: PublicSpot): FirebaseFirestore.DocumentData {
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
    }
  },
}
