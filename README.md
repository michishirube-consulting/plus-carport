# プラスカーポート LP

プラスカーポートの静的ランディングページです。ビルドは不要で、GitHub Pagesからそのまま公開できます。

公開サイト：https://michishirube-consulting.github.io/plus-carport/

2026-09-21：オーダーカーポートの参考ギャラリー4タイプと、選択したタイプを相談文に引き継ぐ導線を追加しました。提供スクリーンショットを加工した画像は公開版から取り除き、機能要件だけをもとにゼロから生成したオリジナル画像へ差し替えています。「施工実績」とは表示していません。

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

現在は確認用です。GitHubへアップロードしても、次の設定が終わるまでは検索エンジンに登録されない構成です。

### 1. 公式LINE URL

`public/index.html` の次の箇所へ、正式なLINE URLを設定します。

```html
<script id="contact-config" type="application/json">{"lineUrl":"https://lin.ee/正式なID"}</script>
```

使用できるのは、パスを含む `https://lin.ee/...` または `https://line.me/...` です。空欄の間はLINEボタンが無効になります。

### 2. 実際の事業情報

- 実施工写真
- 条件と税込表記を伴う実価格
- 施工対応エリア
- 正式な会社情報・プライバシーポリシー
- 実際の保証・資格・施工実績

確認できていない実績、価格、口コミ、保証は追加しないでください。

### 3. 検索エンジンへの公開

上記の確認後、`public/index.html` のrobots指定を次へ変更します。

```html
<meta name="robots" content="index,follow,max-image-preview:large" />
```

続けて `public/robots.txt` を次へ変更します。

```text
User-agent: *
Allow: /
```

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
- `public/assets/` — ロゴと画像
- `.github/workflows/pages.yml` — GitHub Pages自動公開

## 公開時の注意

- LINEのボタンクリックは問い合わせ完了ではありません。実際に届いた初回相談数を主KPIとして管理してください。
- ページ内イベントは `dataLayer` に追加されますが、GA4やGTM自体は接続されていません。
- 既存の住宅・カーポート画像は完成イメージです。オーダー欄の4枚はAI生成の設計イメージです。実績として紹介する際は、施工主体と掲載許可を確認した実写真に差し替えてください。
