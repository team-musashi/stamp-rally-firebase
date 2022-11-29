/**
 * スタンプラリー
 */
export class StampRally {
  /**
   * タイトル
   */
  title = ``

  /**
   * スタンプラリー詳細
   */
  explanation = ``

  /**
   * 場所
   */
  place = ``

  /**
   * 所要時間
   */
  requiredTime = -1

  /**
   * 画像URL
   */
  imageUrl = ``

  /**
   * 期間開始日
   */
  startDate: Date = new Date()

  /**
   * 期間終了日
   */
  endDate?: Date

  /**
   * コンストラクタ
   */
  constructor(partial?: Partial<StampRally>) {
    Object.assign(this, partial)
  }
}
