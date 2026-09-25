# プラスカーポート LP｜引継ぎメモ

最終確認: 2026-09-25。**相談アプリ・UTAGEも含む全体の引継ぎ書は、非公開リポジトリ [`plus-carport-consult` の `HANDOFF.md`](https://github.com/michishirube-consulting/plus-carport-consult/blob/main/HANDOFF.md) にあります。** 次の担当者にはこの非公開リポジトリへの閲覧権限も付与してください。

## このリポジトリが管理する範囲

- [GitHub PagesのLP](https://michishirube-consulting.github.io/plus-carport/)のソース。`public/`をGitHub Actionsで配信します。
- ロゴカラーの青を基調にしたビジュアル・図解・スマホ対応、CTA、プライバシー文の原案。リッチメニューのデザインファイルは`design/`にあります。
- LINE相談は[別のVercelアプリ](https://plus-carport-consult.vercel.app/line/consult?mode=direct)へ遷移します。価格シミュレーターも別アプリであり、このLPリポジトリからはデプロイされません。

## 公開前に残る確認

- `public/index.html`は`noindex`です。会社情報、写真の利用許可、価格・実績・保証の根拠、プライバシー文を確認してから検索公開を判断してください。
- LPの`dataLayer`イベントだけでは実際の問い合わせ率は測れません。GA4/GTMの共通IDは未設定で、LINEトークで送信された初回相談数との突合が必要です。
- リッチメニュー画像の存在は、LINE公式に公開済みである証拠ではありません。UTAGEの挨拶・自動応答・ステップ配信も未検証です。
- 実際のLINEユーザーでLP→LIFF→相談保存→3案→LINE送信→UTAGE受信まで一巡するテストが残っています。

## 変更と戻し方

`main`へのプッシュはGitHub ActionsのPages公開につながります。変更前に`git diff`とスマホ表示を確認してください。以前の版にはGit履歴から戻せます。相談アプリの変更・Vercel本番反映は**このリポジトリではなく**、上記の非公開リポジトリとVercelで行います。
