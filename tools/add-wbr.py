#!/usr/bin/env python3
"""見出し・ボタン・短い説明文に、文節の切れ目の改行候補 <wbr> を入れる。

iPhone の Safari（LINE 内のブラウザも同じ）は、日本語を文節で改行する CSS
（word-break: auto-phrase）に対応していない。そのため「聞かせてくださ／い。」の
ような改行が起きる。Google の BudouX で文節を分けて <wbr> を入れ、CSS の
word-break: keep-all で <wbr> の位置だけで改行させる（public/lp-refine-20260929.css）。

文言を変えたら、もう一度実行してください。何度実行しても同じ結果になります。

    python3 -m pip install budoux
    python3 tools/add-wbr.py public/index.html

対象を増やすときは、下の TARGET_TAGS・TARGET_CLASSES と CSS のセレクタを両方直す。
"""
import re
import sys
from pathlib import Path

import budoux

# この要素の中の文字に <wbr> を入れる（CSS で word-break: keep-all を付けている要素と同じ）
TARGET_TAGS = {"h1", "h2", "h3", "h4", "summary", "figcaption", "strong", "small", "dt", "dd"}
TARGET_CLASSES = {
    "section-number", "hero-lead", "hero-side-copy", "hero-area", "button-note", "header-tagline",
    "line-button", "text-link", "decision-card-text", "case-banner", "case-kicker", "case-mobile-desc",
    "image-note", "consult-image-note", "custom-photo-label", "custom-category",
    "journey-label", "journey-bubble", "journey-screen-note", "journey-message-preview",
    "reason-document-heading", "estimate-map-total", "estimate-map-after",
    "network-story-copy", "handoff-actor", "handoff-return",
    "guide-photo-legend", "parking-diagram-copy", "consult-assurance", "faq-aside-copy", "final-copy",
}
# CSS で white-space: nowrap（1行に固定）にしている所には入れない。
# Chrome は nowrap の中でも <wbr> で改行してしまうため。".クラス" か ".クラス タグ" で書く
SKIP = {".header-tagline", ".parking-callout--entry", ".handoff-arrow span",
        ".estimate-map-total span", ".estimate-map-after strong", ".case-banner strong"}
VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"}
RAW = {"script", "style", "title", "textarea"}
JAPANESE = re.compile(r"[぀-ヿ一-鿿]")
TOKEN = re.compile(r"<!--.*?-->|<[^>]+>|[^<]+", re.S)


def is_skipped(stack):
    for selector in SKIP:
        parts = selector.split()
        if len(parts) == 1 and any(parts[0][1:] in classes for _, classes in stack):
            return True
        if len(parts) == 2 and stack[-1][0] == parts[1] and any(parts[0][1:] in classes for _, classes in stack[:-1]):
            return True
    return False


def is_target(stack):
    if not stack or is_skipped(stack):
        return False
    return any(name in TARGET_TAGS or classes & TARGET_CLASSES for name, classes in stack)


def add_wbr(source, parser):
    source = re.sub(r"<wbr\s*/?>", "", source)  # 入れ直すので、いったん外す
    out, stack = [], []
    for token in TOKEN.findall(source):
        if token.startswith("<!") or token.startswith("<?"):
            out.append(token)
        elif token.startswith("</"):
            name = token[2:-1].strip().lower()
            while stack and stack.pop()[0] != name:
                pass
            out.append(token)
        elif token.startswith("<"):
            name = re.match(r"<\s*([a-zA-Z0-9]+)", token).group(1).lower()
            if name not in VOID and not token.endswith("/>"):
                classes = re.search(r'\sclass="([^"]*)"', token)
                stack.append((name, set(classes.group(1).split()) if classes else set()))
            out.append(token)
        elif (any(name in RAW for name, _ in stack) or "&" in token
              or not JAPANESE.search(token) or not is_target(stack)):
            out.append(token)
        else:
            body = token.strip()
            start = token.index(body)
            out.append(token[:start] + "<wbr>".join(phrases(body, parser)) + token[start + len(body):])
    return "".join(out)


# BudouX が途中で分けてしまう言葉（ここに足すと、その言葉の中では改行しない）
KEEP_TOGETHER = ["買い替え"]


def phrases(text, parser):
    """BudouX の文節。長い会社名は「株式会社」の前でも改行できるようにする。"""
    result = []
    for chunk in parser.parse(text):
        head, sep, tail = chunk.partition("株式会社")
        if sep and len(head) >= 4:
            result += [head, sep + tail]
        else:
            result.append(chunk)
    # KEEP_TOGETHER の言葉をまたぐ切れ目はつなぎ直す
    merged = []
    for chunk in result:
        if merged and any(splits(merged[-1], chunk, word) for word in KEEP_TOGETHER):
            merged[-1] += chunk
        else:
            merged.append(chunk)
    return merged


def splits(left, right, word):
    """left と right の境目が word の途中にあるか。"""
    start = (left + right).find(word, max(0, len(left) - len(word) + 1))
    return start != -1 and start < len(left) < start + len(word)


if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit(__doc__)
    path = Path(sys.argv[1])
    before = path.read_text()
    after = add_wbr(before, budoux.load_default_japanese_parser())
    path.write_text(after)
    print(f"{path}: <wbr> {before.count('<wbr>')} → {after.count('<wbr>')}")
