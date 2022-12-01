import { PublicSpot } from '../../public-stamp-rally/entity/publicSpot'

/**
 * 参加スポット
 */
export class EntrySpot extends PublicSpot {
  /**
   * 公開スポットID
   */
  publicSpotId?: string

  /**
   * スタンプ取得日
   */
  gotDate?: Date

  /**
   * コンストラクタ
   */
  constructor(partial?: Partial<EntrySpot>) {
    super(partial)
  }

  /**
   * 公開スポットから生成する
   */
  static fromPublicSpot(publicSpot: PublicSpot) {
    const instance = new EntrySpot(publicSpot)
    instance.publicSpotId = instance.id
    instance.id = undefined
    return instance
  }
}
