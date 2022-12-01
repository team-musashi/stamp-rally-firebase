import { FieldValue, FirestoreDataConverter } from 'firebase-admin/firestore'
import { PublicSpot } from './entity/publicSpot'

export const spotConverter: FirestoreDataConverter<PublicSpot> = {
  fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot): PublicSpot {
    const data = snapshot.data()
    return {
      id: snapshot.id,
      imageUrl: data.imageUrl,
      order: data.order,
      location: data.location,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    }
  },
  toFirestore(spot: PublicSpot): FirebaseFirestore.DocumentData {
    return {
      imageUrl: spot.imageUrl,
      order: spot.order,
      location: spot.location,
      createdAt: spot.createdAt ? FieldValue.serverTimestamp() : undefined,
      updatedAt: FieldValue.serverTimestamp(),
    }
  },
}
