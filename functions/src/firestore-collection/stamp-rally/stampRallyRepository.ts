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
}
