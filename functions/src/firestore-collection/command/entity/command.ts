/**
 * コマンド
 */
export class Command {
  /**
   * ID
   */
  id?: string

  /**
   * ユーザーID
   */
  uid?: string

  /**
   * コマンドタイプ
   */
  commandType?: CommandType

  /**
   * データ
   */
  data?: Map<string, unknown>

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
  constructor(partial?: Partial<Command>) {
    Object.assign(this, partial)
  }
}

/**
 * コマンドタイプ
 */
export type CommandType = `entryStampRally` | `completeStampRally` | `withdrawStampRally`
