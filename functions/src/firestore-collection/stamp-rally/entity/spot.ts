/**
 * スポット
 */
export class Spot {
  /**
   * ID
   */
  id?: string

  /**
   * スポットの順番
   */
  order?: number

  /**
   * 画像URL
   */
  imageUrl?: string

  /**
   * 緯度経度
   */
  location?: Geolocation

  /**
   * スタンプ取得日
   */
  gotDate?: Date

  /**
   * 作成日時
   */
  createdAt?: Date

  /**
   * 更新日時
   */
  updatedAt?: Date

  /**
   * コンストラクタ
   */
  constructor(partial?: Partial<Spot>) {
    Object.assign(this, partial)
  }
}
