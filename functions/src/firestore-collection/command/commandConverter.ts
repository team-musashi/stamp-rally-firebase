import { Command } from './entity/command'
import { FieldValue, FirestoreDataConverter } from 'firebase-admin/firestore'

export const commandConverter: FirestoreDataConverter<Command> = {
  fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot): Command {
    const data = snapshot.data()
    return {
      uid: data.uid,
      commandType: data.commandType,
      data: data.data,
      createdAt: data.createdAt.toDate(),
    }
  },
  toFirestore(command: Command): FirebaseFirestore.DocumentData {
    return {
      uid: command.uid,
      commandType: command.commandType,
      data: command.data,
      createdAt: FieldValue.serverTimestamp(),
    }
  },
}
