import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { test } from 'node:test';

function routing() {
  const window = {};
  runInNewContext(readFileSync(new URL('../public/source-routing.js', import.meta.url), 'utf8'), { window, URL, URLSearchParams });
  return window.CarportSourceRouting;
}

test('3媒体の入口を識別し、UTMが消えてもsrcから対応する相談入口へ進める', () => {
  const api = routing();
  for (const source of ['instagram', 'tiktok', 'youtube']) {
    for (const query of [`?src=${source}`, `?utm_source=${source}`]) {
      const url = new URL(api.consultationUrl(query, 'two-car'));
      assert.equal(url.origin, 'https://plus-carport-consult.vercel.app');
      assert.equal(url.pathname, '/line/start');
      assert.equal(url.searchParams.get('src'), source);
      assert.equal(url.searchParams.get('utm_source'), source);
      assert.equal(url.searchParams.get('plan'), 'two-car');
    }
  }
  assert.equal(new URL(api.consultationUrl('?src=unknown', '')).searchParams.get('src'), 'lp');
});

test('シミュレーターにも媒体を渡し、商品選択後の引き継ぎに備える', () => {
  const url = new URL(routing().simulatorUrl('https://plus-carport-consult.vercel.app/carport', '?src=youtube&utm_campaign=profile&metrics_test=1'));
  assert.equal(url.pathname, '/carport');
  assert.equal(url.searchParams.get('src'), 'youtube');
  assert.equal(url.searchParams.get('utm_medium'), 'social');
  assert.equal(url.searchParams.get('utm_campaign'), 'profile');
  assert.equal(url.searchParams.get('metrics_test'), '1');
});

test('相談先を入力URLで変更せず、未許可のプラン・個人情報・クエリを引き継がない', () => {
  const url = new URL(routing().consultationUrl('?src=instagram&utm_source=youtube&utm_campaign=taro%40example.com&email=private&redirect=https://evil.test&draft=untrusted', 'evil-plan'));
  assert.equal(url.searchParams.get('utm_source'), 'instagram');
  for (const key of ['utm_campaign', 'email', 'redirect', 'draft', 'plan']) assert.equal(url.searchParams.has(key), false);
  assert.equal(routing().simulatorUrl('https://evil.test/carport', '?src=tiktok'), null);
});

test('本番LPがルーティング処理を先に読み、既存のLINE・プラン別・価格の導線で使う', () => {
  const html = readFileSync(new URL('../public/index.html', import.meta.url), 'utf8');
  assert.ok(html.indexOf('src="source-routing.js') < html.indexOf('src="script.js'));
  const script = readFileSync(new URL('../public/script.js', import.meta.url), 'utf8');
  assert.match(script, /CarportSourceRouting/);
  assert.match(script, /\.consultationUrl\(/);
  assert.match(script, /\.simulatorUrl\(/);
});
