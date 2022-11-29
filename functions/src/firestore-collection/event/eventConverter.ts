import { Event } from '../event/entity/event'
import { FieldValue, FirestoreDataConverter } from 'firebase-admin/firestore'

export const eventConverter: FirestoreDataConverter<Event> = {
  fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot): Event {
    const data = snapshot.data()
    return {
      uid: data.uid,
      eventType: data.eventType,
      data: data.data,
      createdAt: data.createdAt.toDate(),
    }
  },
  toFirestore(event: Event): FirebaseFirestore.DocumentData {
    return {
      uid: event.uid,
      eventType: event.eventType,
      data: event.data,
      updatedAt: FieldValue.serverTimestamp(),
    }
  },
}
