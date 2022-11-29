/**
 * イベント
 */
export class Event {
  /**
   * ユーザーID
   */
  uid = ``

  /**
   * イベントタイプ
   */
  eventType = ``

  /**
   * データ
   */
  data: Map<string, object> = new Map()

  /**
   * 作成日時
   */
  createdAt: Date = new Date()

  /**
   * コンストラクタ
   */
  constructor(partial?: Partial<Event>) {
    Object.assign(this, partial)
  }
}
