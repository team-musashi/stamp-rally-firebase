import 'reflect-metadata'
import { inject, injectable, LazyServiceIdentifer } from 'inversify'
import { CollectionReference } from 'firebase-admin/firestore'
import { PublicStampRally } from './entity/publicStampRally'
import { providers } from '../../config/dicon'
import { PublicSpot } from './entity/publicSpot'
import { publicSpotConverter } from './publicSpotConverter'
import * as dayjs from 'dayjs'

/**
 * 公開スタンプラリーリポジトリ
 */
@injectable()
export class PublicStampRallyRepository {
  constructor(
    /**
     * コレクション参照
     */
    @inject(new LazyServiceIdentifer(() => providers.publicStampRallyRef))
    private collectionRef: CollectionReference<PublicStampRally>
  ) {}

  /**
   * 公開スタンプラリーを返す
   */
  async get({ id }: { id: string }): Promise<PublicStampRally | undefined> {
    const snapshot = await this.collectionRef.doc(id).get()
    return snapshot.data()
  }

  /**
   * 公開スタンプラリーを更新する
   */
  async update({ publicStampRally }: { publicStampRally: PublicStampRally }): Promise<void> {
    if (!publicStampRally.id) return
    publicStampRally.updatedAt = dayjs().toDate()
    await this.collectionRef.doc(publicStampRally.id!).update(publicStampRally)
  }

  /**
   * 公開スタンプラリー配下のスポットリストを返す
   */
  async getSpots({ id }: { id: string }): Promise<PublicSpot[]> {
    const snapshot = await this.collectionRef.doc(id).collection(`publicSpot`).get()
    return snapshot.docs.map((doc) => {
      return publicSpotConverter.fromFirestore(doc)
    })
  }
}
