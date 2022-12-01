import 'reflect-metadata'
import { inject, injectable, LazyServiceIdentifer } from 'inversify'
import { CollectionReference } from 'firebase-admin/firestore'
import { User } from './entity/user'
import { providers } from '../../config/dicon'
import * as dayjs from 'dayjs'
import { PublicStampRally } from '../public-stamp-rally/entity/publicStampRally'
import { PublicSpot } from '../public-stamp-rally/entity/publicSpot'
import { publicStampRallyConverter } from '../public-stamp-rally/publicStampRallyConverter'
import { spotConverter } from '../public-stamp-rally/publicSpotConverter'

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
   * ユーザー配下に参加中スタンプラリー/スポットを追加する
   */
  async addStampRally({
    uid,
    stampRally,
    spots,
  }: {
    uid: string
    stampRally: PublicStampRally
    spots: PublicSpot[]
  }): Promise<void> {
    // 複数のコレクションを書き込むためトランザクションで処理する
    const batch = this.collectionRef.firestore.batch()

    // 参加中スタンプラリーのコレクション参照を取得する
    const entryStampRallyCollectionRef = this.collectionRef
      .doc(uid)
      .collection(`entryStampRally`)
      .withConverter(publicStampRallyConverter)

    // 参加中スタンプラリーを追加する
    const entryStampRallyDocRef = entryStampRallyCollectionRef.doc()
    batch.set(entryStampRallyDocRef, stampRally)

    // 参加中スポットリストを追加する
    for (const spot of spots) {
      const entrySpotCollectionRef = entryStampRallyCollectionRef
        .doc(entryStampRallyDocRef.id)
        .collection(`spot`)
        .withConverter(spotConverter)
      batch.set(entrySpotCollectionRef.doc(), spot)
    }

    // コミット
    await batch.commit()
  }
}
