# SNSに掲載するLPのURL

2026-10-23。掲載先ごとに、次のURLをそのまま使用する。

| 掲載先 | URL |
| --- | --- |
| Instagram | https://michishirube-consulting.github.io/plus-carport/?src=instagram |
| TikTok | https://michishirube-consulting.github.io/plus-carport/?src=tiktok |
| YouTube | https://michishirube-consulting.github.io/plus-carport/?src=youtube |

`src`は媒体を判別する目印。リンクを開く際に`utm_*`が除かれた試行があったため、配布URLは短い`src`を使う。LPは相談・価格シミュレーターへの移動時に、対応する`utm_source`と`utm_medium=social`も付ける。`utm_source`だけで来た場合も上記3媒体を判別する。

## LINEへの進み方

LPの17か所の相談ボタンは相談アプリの`/line/start`へ進む。

1. 初めての方は「LINEで友だち追加する」。媒体に対応するUTAGEを別の画面で開く。
2. 追加後は元の画面へ戻り「相談フォームへ進む」。追加済みの方はこの操作から始められる。

UTAGEの登録リンクは友だち追加画面で終わり、商品の下書きや任意の戻り先を渡す仕様は確認できなかった。登録URLに未確認のパラメータを追加して自動で戻ったことにはせず、続行ボタンを明示している。

## 確認済みのUTAGE経路

plusカーポート / 挨拶メッセージ / 登録経路の実画面で2026-10-23に確認。下記は公開用の登録URLであり認証情報ではない。

| 媒体 | 登録URL |
| --- | --- |
| Instagram | https://utage-system.com/line/open/rXcLvQ7Ay3s0?mtid=XdIstZrNWZSI |
| TikTok | https://utage-system.com/line/open/rXcLvQ7Ay3s0?mtid=NgcQQs28pf3P |
| YouTube | https://utage-system.com/line/open/rXcLvQ7Ay3s0?mtid=1D6oFOLmHN1D |
| 目印なし・不明な入口 | https://utage-system.com/line/open/rXcLvQ7Ay3s0?mtid=8oMpo4M5zeEp （LPからの流入） |

固定対応表は相談アプリの`src/lib/line-source-routing.ts`で管理する。HP用・エクスショップ風用の既存経路は今回変更していない。

## 引き継ぎと確認範囲

- LPのカードの`plan`は、LINE内の相談フォームまで残す。
- 価格シミュレーターにも媒体を渡し、カーポートの商品選択後は商品・仕様の署名付き下書きと元の訪問IDを相談へ渡す。
- UTAGEには登録経路のURLだけを渡す。商品下書き・訪問ID・入力した相談内容はUTAGE登録URLに追加しない。
- UTAGEの初回友だち追加経路と、アプリ側の今回の相談送信の流入元は別の指標。追加済みの人の初回経路は変更しない。
- SNSプロフィールの掲載作業と、新しい友だちによるUTAGE経路の受入確認は、このコードのテストとは別に必要。

検証: `node --test tests/source-routing.test.mjs`。相談アプリの`tests/browser/sns-source-routing.mjs`は外部通信を止め、3媒体の全LP相談ボタン・価格ボタン・プラン・商品情報・接続失敗後の再開をローカルで確認する。

公開順序は相談アプリを先、LPを後にする。戻す際はLPを先に旧版へ戻してから相談アプリを戻す。
