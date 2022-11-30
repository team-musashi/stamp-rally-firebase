/**
 * スポット
 */
export class Spot {
  /**
   * 順番
   */
  order = -1

  /**
   * 画像URL
   */
  imageUrl = ``

  /**
   * 座標
   */
  location?: Geolocation

  /**
   * スタンプ取得日
   */
  gotDate?: Date

  /**
   * コンストラクタ
   */
  constructor(partial?: Partial<Spot>) {
    Object.assign(this, partial)
  }
}
