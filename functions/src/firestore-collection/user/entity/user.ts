/**
 * ユーザー
 */
export class User {
  /**
   * ユーザーID
   */
  uid = ``

  /**
   * 認証プロバイダー
   */
  authProvider?: AuthProvider

  /**
   * 作成時のプラットフォーム
   */
  platform?: AppPlatform

  /**
   * 作成日時
   */
  createdAt?: Date

  /**
   * 更新日時
   */
  updatedAt?: Date

  constructor(partial?: Partial<User>) {
    Object.assign(this, partial)
  }
}

/**
 * 認証プロバイダー
 */
export type AuthProvider = `anonymous`

/**
 * アプリのプラットフォーム
 */
export type AppPlatform = `android` | `iOS`
