class Constants {
  /**
   * リージョン
   */
  region = `asia-northeast1`

  /**
   * タイムゾーン
   */
  timezone = `Asia/Tokyo`

  /**
   * 秘匿情報のリスト
   * runWith() への引数として利用する。
   * 秘匿情報を追加したらここに追加すること。
   */
  secrets = []
}

export const constants = new Constants()
