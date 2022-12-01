/**
 * スタンプラリー
 */
export class StampRally {
  /**
   * ID
   */
  id?: string

  /**
   * スタンプラリー名称
   */
  title?: string

  /**
   * スタンプラリーの詳細説明
   */
  explanation?: string

  /**
   * 開催場所
   */
  place?: string

  /**
   * 所要時間
   */
  requiredTime?: number

  /**
   * 画像URL
   */
  imageUrl?: string

  /**
   * 開催開始日
   */
  startDate?: Date

  /**
   * 開催終了日
   */
  endDate?: Date

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
  constructor(partial?: Partial<StampRally>) {
    Object.assign(this, partial)
  }
}
