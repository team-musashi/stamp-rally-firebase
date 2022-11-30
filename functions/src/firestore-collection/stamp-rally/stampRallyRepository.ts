import 'reflect-metadata'
import { inject, injectable, LazyServiceIdentifer } from 'inversify'
import { CollectionReference } from 'firebase-admin/firestore'
import { StampRally } from '../stamp-rally/entity/stampRally'
import { providers } from '../../config/dicon'

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
  async get({ inputKey }: { inputKey: string }): Promise<StampRally> {
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
}
