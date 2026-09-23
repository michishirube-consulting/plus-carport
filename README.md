# プラスカーポート LP

プラスカーポートの静的ランディングページです。ビルドは不要で、GitHub Pagesからそのまま公開できます。

公開サイト：https://michishirube-consulting.github.io/plus-carport/

運営者は、みちしるべコンサルティング株式会社です。プラスカーポートはWeb集客・相談受付・条件整理を担う窓口であり、現地調査、見積もり、契約、施工、保証・アフターサービスは、地域の加盟店・提携施工店が担当します。現在の相談対応エリアは、福岡県を中心とした九州エリア、東海エリア、関東エリアです。

2026-09-21：オーダーカーポートの4つのプラン例を掲載しています。画像は参照写真を入力せず新規生成したもので、「施工実績」とは表示していません。一般住宅になじむ新設カーポートとして、バイクガレージ併設、軽トラック・農具の倉庫併設、屋上デッキ、玄関までつながる屋根を紹介しています。各カードには設計で合わせるポイントを記載し、相談ボタンからプラン別の確認事項と相談文へ引き継ぎます。

2026-09-23：120点ステップとして、ロゴ由来の青を軸にスマホと下層セクションのデザインを統一しました。`public/lp-120.css` は既存CSSの後から読み込む追加レイヤーです。図解は `public/assets/clearance-guide-120.svg`、最後の暮らしの写真はオリジナルのAI生成イメージ `public/assets/final-lifestyle-120.jpg` です。実施工写真・実際の顧客の写真とは表示していません。変更前のローカルコピーは隣の `public-backup-before-120/` に保存してあります。GitHub上ではこの更新の直前コミットへ戻すことで復元できます。

## GitHub Pagesで公開する

1. GitHubで新しいリポジトリを作成します。既定ブランチ名は `main` にします。
2. このフォルダの中身をすべてリポジトリへ追加し、`main` へプッシュします。
3. GitHubのリポジトリで **Settings → Pages → Build and deployment → Source** を **GitHub Actions** に設定します。
4. **Actions** タブで `Deploy Plus Carport to GitHub Pages` が完了すると、PagesのURLが表示されます。

公開処理は `.github/workflows/pages.yml` が行い、`public/` の中だけを配信します。

Gitコマンドで登録する場合は、リポジトリ作成後に次を実行します。`YOUR-ACCOUNT` と `YOUR-REPOSITORY` は実際の名前へ置き換えてください。

```sh
git init -b main
git add .
git commit -m "Initial Plus Carport site"
git remote add origin https://github.com/YOUR-ACCOUNT/YOUR-REPOSITORY.git
git push -u origin main
```

## 一般公開前に必ず設定する項目

現在は確認用です。GitHubへアップロードしても、次の設定が終わるまではHTMLの `noindex` により検索エンジンへ登録されない構成です。クローラーが `noindex` を確認できるよう、`robots.txt` ではページのクロール自体は許可しています。

### 1. 公式LINE URL

`public/index.html` の次の箇所へ、正式なLINE URLを設定します。

```html
<script id="contact-config" type="application/json">{"lineUrl":"https://lin.ee/正式なID"}</script>
```

使用できるのは、パスを含む `https://lin.ee/...` または `https://line.me/...` です。空欄の間はLINEボタンが無効になります。

### 2. 公開前に確定する事業情報

- 実施工写真
- 条件と税込表記を伴う実価格
- みちしるべコンサルティング株式会社の所在地・代表者名・個人情報問い合わせ先
- 実際の保証・資格・施工実績
- 加盟店募集の専用問い合わせ先

確認できていない実績、価格、口コミ、保証は追加しないでください。

### 3. 検索エンジンへの公開

上記の確認後、`public/index.html` のrobots指定を次へ変更します。

```html
<meta name="robots" content="index,follow,max-image-preview:large" />
```

`public/robots.txt` は変更不要です。GitHub Pagesのプロジェクトサイトでは、オリジン直下の `/robots.txt` は別リポジトリの管理範囲になるため、このファイルだけにインデックス制御を依存しないでください。検索公開の切り替えは上記のHTML robots指定で行います。サイトマップは `public/sitemap.xml` です。

## ローカル確認

Pythonが利用できる場合は、リポジトリのルートで次を実行します。

```sh
python3 -m http.server 4173 -d public
```

ブラウザで `http://127.0.0.1:4173/` を開きます。

## ファイル構成

- `public/index.html` — LP本体と検索向け情報
- `public/styles.css` — レスポンシブデザイン
- `public/script.js` — CTA・LINE接続・計測イベント
- `public/planner.js` — 相談内容の選択ロジック
- `public/privacy.html` — 個人情報の利用目的と施工店への情報提供方針
- `public/partners.html` — 加盟店・施工パートナー募集ページ
- `public/robots.txt` — クロール方針とサイトマップURL
- `public/sitemap.xml` — 公開URLのXMLサイトマップ
- `public/assets/` — ロゴと画像
- `.github/workflows/pages.yml` — GitHub Pages自動公開

## 公開時の注意

- LINEのボタンクリックは問い合わせ完了ではありません。実際に届いた初回相談数を主KPIとして管理してください。
- ページ内イベントは `dataLayer` に追加されますが、GA4やGTM自体は接続されていません。
- 既存の住宅・カーポート画像は完成イメージです。オーダー欄の4枚はAI生成の設計イメージです。実績として紹介する際は、施工主体と掲載許可を確認した実写真に差し替えてください。
- 施工店へ相談者の個人データを提供する場合は、事前に本人同意を取得し、法令に従って提供記録を作成・保存してください。
- `public/privacy.html` は現行の事業モデルに合わせた公開用原案です。正式公開前に所在地・代表者・問い合わせ先を追記し、必要に応じて専門家の確認を受けてください。
