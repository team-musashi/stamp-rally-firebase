import 'reflect-metadata'
import { inject, injectable, LazyServiceIdentifer } from 'inversify'
import { CollectionReference } from 'firebase-admin/firestore'
import { StampRally } from '../stamp-rally/entity/stampRally'
import { providers } from '../../config/dicon'
import { Spot } from './entity/spot'
import { spotConverter } from './spotConverter'

/**
 * スタンプラリーリポジトリ
 */
@injectable()
export class StampRallyRepository {
  constructor(
    /**
     * コレクション参照
     */
    @inject(new LazyServiceIdentifer(() => providers.stampRallyRef))
    private collectionRef: CollectionReference<StampRally>
  ) {}

  /**
   * スタンプラリーを追加する
   */
  async add({ inputKey, inputValue }: { inputKey: string; inputValue: StampRally }): Promise<void> {
    await this.collectionRef.doc(inputKey).set(inputValue)
  }

  /**
   * スタンプラリーを返す
   */
  async get({ id }: { id: string }): Promise<StampRally | undefined> {
    const snapshot = await this.collectionRef.doc(id).get()
    return snapshot.data()
  }

  /**
   * スタンプラリー配下のスポットリストを返す
   */
  async getSpots({ id }: { id: string }): Promise<Spot[]> {
    const snapshot = await this.collectionRef.doc(id).collection(`spot`).get()
    return snapshot.docs.map((doc) => {
      return spotConverter.fromFirestore(doc)
    })
  }
}
