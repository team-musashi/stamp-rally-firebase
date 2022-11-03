import 'reflect-metadata'
import * as admin from 'firebase-admin'
import { constants } from './config/constants'

/**
 * Firestore Admin SDK の初期化
 */
admin.initializeApp()

/**
 * タイムゾーンの初期化
 */
process.env.TZ = constants.timezone

/**
 * ここでデプロイする関数をまとめる
 * admin.initializeApp() の順序の問題でデプロイに失敗するため
 */
import { onCreateAuthUser } from './functions/auth-user/onCreateAuthUser'

/**
 * デプロイする関数一覧
 */
export { onCreateAuthUser }
