# スタラリ Firebase

下記に関するコードが含まれています。

- Firebase Functions
- Firebase Firestore
- Firebase Storage

## 開発環境をセットアップしよう

開発マシンの OS は Mac、IDE は VSCode の利用を前提としています。
Functions で TypeScript を実装するときは、次の VSCode 拡張機能をインストールしてください。

- Prettier - Code formatter

## git clone や git pull したときに気をつけること

`package.json`が更新されていた場合は functions ディレクトリ内で次のコマンドを実行して、ローカルに反映させます。

```
cd functions
npm install
```

これをしないと、`package.json`の更新が各ファイルに反映されず、import エラーになってしまいます。

## google map api 関連

```
npm install @googlemaps/google-maps-services-js
npm install @google/maps
npm i --save-dev @types/google__maps
```

## Firestore セキュリティルールを修正する

`firestore.rules` を修正してコミットしてください。

## Firestore インデックスを修正する

まず、開発環境の Firebase コンソール上でインデックスを修正してください。
次のコマンドを実行して、Firesbase コンソール上のインデックス情報をローカルに反映させます。

```
make get-firestore-indexes
```

変更された `firestore.indexes.json` をコミットしてください。

## Storage セキュリティルールを修正する

`storage.rules` を修正してコミットしてください。

## Functions を修正する

### 秘匿情報の扱い方

Firebase Functions 内で扱う秘匿情報は Secret Manager で管理しています。
Secret Manager への秘匿情報の登録・更新・取得・削除については以下の記事を参照してください。

https://firebase.google.com/docs/functions/config-env#managing_secrets

ローカル環境で秘匿情報を扱いたい場合は `functions/.secret.local.default` をコピーして `functions/.secret.local` を作成して、各秘匿情報を埋めてください。

### 管理している秘匿情報

| キー名             | 内容                                                     |
| ------------------ | -------------------------------------------------------- |
| GOOGLE_MAP_API_KEY | GoogleMapsAPI（Directions API）を使用するための API キー |

### デプロイ前の Functions をローカルでデバッグする方法

Firebase エミュレータ.Firestore を使用することにより、ローカル開発環境でブレークポイントを設置することができます。

#### 手順

1. 次のコマンドを `プロジェクトフォルダ/functions` で実行します。

```
firebase emulators:start --inspect-functions --import=../dump
```

2. 各 Firebase エミュレータサービスの中から `Firestore` を選択してエミュレータを起動します。
3. VS Code の `実行とデバッグタブ` で `functions` を選択して実行ボタンを押下します。（エミュレータのプロセスを選択すること）
   <img width="610" alt="スクリーンショット 2023-02-20 19 49 08" src="https://user-images.githubusercontent.com/39579511/220085214-7f645751-e248-48a4-9ec9-94f508b1fd71.png">

#### 補足

- dump ファイルを利用して Firebase エミュレータのデータ永続化を行っています。
- `firebase emulators:start`コマンドで、 `--import=../dump` オプションを指定することで、dump フォルダ内のデータを元にエミュレータを起動します。
- また、Firebase エミュレータ起動中に `firebase emulators:export dump` コマンドを実行することで、コマンド実行時点の内容を dump ファイルに書き込むことができます。

## フォルダ構成

DI コンテナは [InversifyJS](https://github.com/inversify/InversifyJS) を利用しています。

```
├── config                                   定数、DI コンテナの設定値
├── firestore-collection                     Firestore コレクション関連
│   └── <collection>
│       ├── entity                           コレクション単位のエンティティ
│       └── <collection>Repository.ts        コレクションリポジトリ
├── functinos                                公開関数
│   └── <関数の種別>                           pubsub や Collection 名
│       └── <function-name>.ts               公開関数（関数毎にファイルを分ける）
└── service                                  外部APIなど
    └── <service>                            各サービス毎のディレクトリ
```

## ブランチモデル

git-flow を採用していますが、`release branches` は未採用で、`develop` => `main` に直接マージしています。

<img src="https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.amazonaws.com%2F0%2F53309%2F06140121-a0b6-427f-c149-6858c149738e.png?ixlib=rb-4.0.0&auto=format&gif-q=60&q=75&w=1400&fit=max&s=e54e831191e127e8ec6ed4425c7dfe86" width=400>

- 参考サイト
  - [Git-flow って何？](https://qiita.com/KosukeSone/items/514dd24828b485c69a05)

## CI (継続的インテグレーション)

運用していません。

## CD (継続的デリバリー)

GitHub Actions を利用して CD を構築しています。

| 発火タイミング                 | デプロイ動作             |
| ------------------------------ | ------------------------ |
| `develop` に `push` されたとき | 開発環境にデプロイします |
| `main` に `push` されたとき    | 本番環境にデプロイします |

### 自動デプロイ時の GCP サービスアカウントについて

GitHub Actions 上における Firebase へのデプロイは、「github-actions」という GCP サービスアカウントを使ってデプロイを行っています。「github-actions」にはデプロイに必要な各権限を付与しています。管理方法は次のとおりです（開発環境の例）。

#### GCP サービスアカウントを確認したい

https://console.cloud.google.com/iam-admin/serviceaccounts?authuser=1&project=flutteruniv-stamp-rally-dev

![GCP_SA](https://user-images.githubusercontent.com/13707135/199376040-66968ed4-0535-40d3-bc13-d5271620a653.png)

#### GCP サービスアカウントのキーを再発行したい

GitHub Actions 上で GCP サービスアカウントを使ってデプロイするためには、GitHub Secrets にサービスアカウントの JSON キーを BASE64 エンコードした文字列を設定する必要があります。サービスアカウントのキーを更新する方法は次のとおりです。

1． GCP 上でキーを再発行する

下記にアクセスし、鍵を追加し、 JSON 形式でダウンロードします。

https://console.cloud.google.com/iam-admin/serviceaccounts/details/103482993164636776626/keys?authuser=1&project=flutteruniv-stamp-rally-dev

![キーの追加](https://user-images.githubusercontent.com/13707135/199376281-eb8e2e3b-b710-4b0d-89ca-92d8fcd163d1.png)

2．BASE64 エンコードする

次のコマンド（例）を実行して、保存した JSON ファイルを BASE64 エンコードします。

```
base64 -i flutteruniv-stamp-rally-dev-0786a139b6a4.json -o base64.txt
```

3．GitHub Secrets に登録する

下記にアクセスし（要管理者権限）、BASE64 エンコードした文字列で上書きします。`STAMP_RALLY_GCP_SA_KEY_DEV` が開発環境用、`STAMP_RALLY_GCP_SA_KEY_PROD` が本番環境用です。

https://github.com/team-musashi/stamp-rally-firebase/settings/secrets/actions

![GitHub Secrets](https://user-images.githubusercontent.com/13707135/199376782-d0c6fe56-4a76-4989-88c0-a20790b8cabe.png)

## ローカルから手動でデプロイしたい

```bash
# 開発環境の Functions をデプロイする
make deploy-functions

# 開発環境の Firestore のセキュリティルールをデプロイする
make deploy-firestore-rules

# 開発環境の Firestore のセインデックスをデプロイする
make deploy-firestore-indexes

# 開発環境の Storage のセキュリティルールをデプロイする
make deploy-storage-rules

# 開発環境の Firestore のインデックスをローカルファイルに上書きする
make get-firestore-indexes
```
