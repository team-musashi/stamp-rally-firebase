import 'reflect-metadata'
import { inject, injectable, LazyServiceIdentifer } from 'inversify'
import { CollectionReference } from 'firebase-admin/firestore'
import { User } from './entity/user'
import { providers } from '../../config/dicon'
import * as dayjs from 'dayjs'
import { entryStampRallyConverter } from '../entry-stamp-rally/entryStampRallyConverter'
import { entrySpotConverter } from '../entry-stamp-rally/entrySpotConverter'
import { EntryStampRally } from '../entry-stamp-rally/entity/entryStampRally'
import { EntrySpot } from '../entry-stamp-rally/entity/entrySpot'

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
   * スタンプラリーに参加する
   */
  async enterStampRally({
    uid,
    stampRally,
    spots,
  }: {
    uid: string
    stampRally: EntryStampRally
    spots: EntrySpot[]
  }): Promise<void> {
    // 複数のコレクションを書き込むためトランザクションで処理する
    const batch = this.collectionRef.firestore.batch()

    // 参加中スタンプラリーのコレクション参照を取得する
    const entryStampRallyCollectionRef = this.collectionRef
      .doc(uid)
      .collection(`entryStampRally`)
      .withConverter(entryStampRallyConverter)

    // 参加中スタンプラリーを追加する
    const entryStampRallyDocRef = entryStampRallyCollectionRef.doc()
    stampRally.status = `entry`
    stampRally.createdAt = dayjs().toDate()
    batch.set(entryStampRallyDocRef, stampRally)

    // 参加中スポットリストを追加する
    for (const spot of spots) {
      const entrySpotCollectionRef = entryStampRallyCollectionRef
        .doc(entryStampRallyDocRef.id)
        .collection(`entrySpot`)
        .withConverter(entrySpotConverter)
      spot.createdAt = dayjs().toDate()
      batch.set(entrySpotCollectionRef.doc(), spot)
    }

    // コミット
    await batch.commit()
  }

  /**
   * 参加中スタンプラリーを完了する
   */
  async completeStampRally({ uid, entryStampId }: { uid: string; entryStampId: string }): Promise<void> {
    // 参加中スタンプラリーのDoc参照を取得する
    const entryStampRallyDocRef = this.collectionRef.doc(uid).collection(`entryStampRally`).doc(entryStampId)

    await entryStampRallyDocRef.update({
      status: `complete`,
      updatedAt: dayjs().toDate(),
    })
  }

  /**
   * 参加中スタンプラリーを中断する
   */
  async withdrawStampRally({ uid, entryStampId }: { uid: string; entryStampId: string }): Promise<void> {
    // 参加中スタンプラリーのDoc参照を取得する
    const entryStampRallyDocRef = this.collectionRef.doc(uid).collection(`entryStampRally`).doc(entryStampId)

    await entryStampRallyDocRef.update({
      status: `withdrawal`,
      updatedAt: dayjs().toDate(),
    })
  }
}
