import { PublicStampRally } from '../../public-stamp-rally/entity/publicStampRally'

/**
 * 参加スタンプラリー
 */
export class EntryStampRally extends PublicStampRally {
  /**
   * 公開スタンプラリーID
   */
  publicStampRallyId?: string

  /**
   * 参加ステータス
   */
  status?: EntryStatus

  /**
   * コンストラクタ
   */
  constructor(partial?: Partial<EntryStampRally>) {
    super(partial)
  }

  /**
   * 公開スタンプラリーから生成する
   */
  static fromPublicStampRally(publicStampRally: PublicStampRally) {
    const instance = new EntryStampRally(publicStampRally)
    instance.publicStampRallyId = instance.id
    instance.id = undefined
    return instance
  }
}

export type EntryStatus = `entry` | `complete` | `withdrawal`
