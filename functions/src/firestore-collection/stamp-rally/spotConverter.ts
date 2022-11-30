import { FirestoreDataConverter } from 'firebase-admin/firestore'
import { Spot } from './entity/spot'

export const spotConverter: FirestoreDataConverter<Spot> = {
  fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot): Spot {
    const data = snapshot.data()
    return {
      imageUrl: data.imageUrl,
      order: data.order,
      location: data.location,
      gotDate: data.gotDate,
    }
  },
  toFirestore(spot: Spot): FirebaseFirestore.DocumentData {
    return {
      imageUrl: spot.imageUrl,
      order: spot.order,
      location: spot.location,
      gotDate: spot.gotDate,
    }
  },
}
