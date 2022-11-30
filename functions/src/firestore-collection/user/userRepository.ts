import 'reflect-metadata'
import { inject, injectable, LazyServiceIdentifer } from 'inversify'
import { CollectionReference } from 'firebase-admin/firestore'
import { User } from './entity/user'
import { providers } from '../../config/dicon'
import * as dayjs from 'dayjs'
import { StampRally } from '../stamp-rally/entity/stampRally'

/**
 * ユーザーリポジトリ
 */
@injectable()
export class UserRepository {
  constructor(
    /**
     * コレクション参照
     */
    @inject(new LazyServiceIdentifer(() => providers.userRef))
    private collectionRef: CollectionReference<User>
  ) {}

  /**
   * ユーザーを追加する
   */
  async add({ input }: { input: User }): Promise<void> {
    input.createdAt = dayjs().toDate()
    await this.collectionRef.doc(input.uid).set(input)
  }

  /**
   * ユーザー配下に参加中スタンプラリーを追加する
   */
  async addEntryStampRally({ inputKey, inputValue }: { inputKey: string; inputValue: StampRally }): Promise<void> {
    await this.collectionRef.doc(inputKey).collection(`entryStampRally`).add(inputValue)
  }
}
