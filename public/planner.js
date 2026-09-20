(function () {
  "use strict";
  const counts = {
    undecided: { label: "台数未定", message: "カーポートを検討しています。", tip: "今と将来の台数、自転車の置き場を含めて、必要な広さを整理しましょう。" },
    "one-car": { label: "1台用", message: "1台用のカーポートを検討しています。", tip: "車の幅に加えて、ドアを開ける幅と、人が立つスペースを確認しましょう。" },
    "two-car": { label: "2台用", message: "2台用のカーポートを検討しています。", tip: "2台を並べた状態で、左右のドアが開くか、どちらの車も出し入れできるかを確認しましょう。" }
  };
  const stages = {
    undecided: { label: "住まい未定", message: "", tip: "敷地が決まっていれば、道路・玄関・駐車スペースの位置関係から確認できます。" },
    retrofit: { label: "後付け", message: "今の家への後付けを考えています。", tip: "既存の土間や配管、撤去が必要なものを確認。柱を立てる工事と補修の範囲も見ておきましょう。" },
    "new-build": { label: "新築", message: "新築に合わせた設置を考えています。", tip: "建物・玄関・駐車場の配置が分かる図面をもとに、外構や配管の工事との順序を確認しましょう。" }
  };
  const priorities = {
    undecided: { label: "優先事項未定", message: "", tip: "停めやすさ・費用・雨の日の使い方・見た目のうち、譲れないことを相談しながら絞れます。" },
    parking: { label: "停めやすさ", message: "駐車と乗り降りのしやすさを重視しています。", tip: "いつもの進入方向、ハンドルを切る場所、乗り降りする側と柱の位置を合わせて確認しましょう。" },
    cost: { label: "工事込みの費用", message: "工事込みの費用を重視しています。", tip: "本体・基本施工・オプション・追加工事をそろえ、税込総額で比較。ご予算も最初に伝えると相談を進めやすくなります。" },
    rain: { label: "雨の日の乗り降り", message: "雨の日の乗り降りを楽にしたいです。", tip: "車を降りる側から玄関までの道筋と屋根の位置を確認。雨の吹き込み方も敷地条件と合わせて考えましょう。" },
    design: { label: "家・愛車との相性", message: "家の外観や愛車との見た目の相性を重視しています。", tip: "外壁や玄関、愛車と合わせて、屋根の色・厚み・柱の見え方を比べましょう。" }
  };
  function known(table, value) {
    return Object.prototype.hasOwnProperty.call(table, value) ? value : "undecided";
  }
  function createPlan(input = {}) {
    const selection = { count: known(counts, input.count), stage: known(stages, input.stage), priority: known(priorities, input.priority) };
    const count = counts[selection.count];
    const stage = stages[selection.stage];
    const priority = priorities[selection.priority];
    const labels = [count.label, stage.label, priority.label].filter(label => !label.includes("未定"));
    return {
      selection,
      context: labels.length ? "選んだ内容：" + labels.join(" ／ ") : "",
      title: (selection.count === "undecided" ? "" : count.label + "の") + "相談で確認したいこと",
      points: [count.tip, stage.tip, priority.tip],
      message: [count.message, stage.message, priority.message, "わが家に合うサイズと、工事込みの費用を相談したいです。"].filter(Boolean).join("\n")
    };
  }
  window.CarportPlanner = Object.freeze({ createPlan });
})();
