/**
 * コマンド
 */
export class Command {
  /**
   * ユーザーID
   */
  uid = ``

  /**
   * コマンドタイプ
   */
  commandType = ``

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
  constructor(partial?: Partial<Command>) {
    Object.assign(this, partial)
  }
}
