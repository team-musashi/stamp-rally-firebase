/**
 * 公開スポット
 */
export class PublicSpot {
  /**
   * ID
   */
  id?: string

  /**
   * スポットの順番
   */
  order?: number

  /**
   * スポット名称
   */
  title?: string

  /**
   * スポットの概要
   */
  summary?: string

  /**
   * スポットの住所
   */
  address?: string

  /**
   * スポットの電話番号
   */
  tel?: string

  /**
   * 画像URL
   */
  imageUrl?: string

  /**
   * 緯度経度
   */
  location?: Geolocation

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
  constructor(partial?: Partial<PublicSpot>) {
    Object.assign(this, partial)
  }
}
