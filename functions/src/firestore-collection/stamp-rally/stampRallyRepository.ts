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
   * ドキュメントID指定でスタンプラリーを取得する
   */
  async getStampRally({ inputKey }: { inputKey: string }): Promise<StampRally> {
    const data = await (await this.collectionRef.doc(inputKey).get()).data
    return {
      title: data()!.title,
      explanation: data()!.explanation,
      place: data()!.place,
      requiredTime: data()!.requiredTime,
      imageUrl: data()!.imageUrl,
      startDate: data()!.startDate,
      endDate: data()!.endDate,
    }
  }

  /**
   * ドキュメントID指定でスタンプラリー配下のスポットを取得する
   */
  async getSpots({ inputKey }: { inputKey: string }): Promise<Spot[]> {
    const spots: Array<Spot> = []
    await this.collectionRef
      .doc(inputKey)
      .collection(`spot`)
      .get()
      .then((querySnapshot) => {
        querySnapshot.docs.map((doc) => {
          spots.push(spotConverter.fromFirestore(doc))
        })
      })
    return spots
  }
}
