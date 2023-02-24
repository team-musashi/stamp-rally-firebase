import { GeoPoint } from 'firebase-admin/firestore'

/**
 * 公開スタンプラリー
 */
export class PublicStampRally {
  /**
   * ID
   */
  id?: string

  /**
   * スタンプラリー名称
   */
  title?: string

  /**
   * スタンプラリーの概要
   */
  summary?: string

  /**
   * エリア
   */
  area?: string

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
   * 経路
   */
  route?: GeoPoint[]

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
  constructor(partial?: Partial<PublicStampRally>) {
    Object.assign(this, partial)
  }
}
