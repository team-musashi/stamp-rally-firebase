import { Command } from './entity/command'
import { FieldValue, FirestoreDataConverter } from 'firebase-admin/firestore'

export const commandConverter: FirestoreDataConverter<Command> = {
  fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot): Command {
    const data = snapshot.data()
    return {
      id: snapshot.id,
      uid: data.uid,
      commandType: data.commandType,
      data: data.data ? new Map(Object.entries(data.data)) : undefined,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    }
  },
  toFirestore(command: Command): FirebaseFirestore.DocumentData {
    return {
      uid: command?.uid,
      commandType: command?.commandType,
      data: command?.data,
      createdAt: command.createdAt ? FieldValue.serverTimestamp() : undefined,
      updatedAt: FieldValue.serverTimestamp(),
    }
  },
}
