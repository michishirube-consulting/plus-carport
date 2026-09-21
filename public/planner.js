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
    design: { label: "家・愛車との相性", message: "家の外観や愛車との見た目の相性を重視しています。", tip: "外壁や玄関、愛車と合わせて、屋根の色・厚み・柱の見え方を比べましょう。" },
    custom: { label: "オーダー設計", message: "オーダーカーポートの設計について相談したいです。", tip: "車とバイク、軽トラックと農具、デッキ、玄関への屋根など、実現したい使い方をお聞かせください。敷地や建物の条件から対応できる形を確認します。" }
  };
  const customStyles = {
    architectural: "車とバイクが別々に出入りできるガレージ併設プラン",
    storage: "軽トラックと農具を収める倉庫併設プラン",
    deck: "屋上デッキ付きのプラン",
    entrance: "玄関まで屋根をつなげるプラン"
  };
  const customTips = {
    architectural: "車を停めたままバイクを出せる通り道と、車体を押して動かす幅、手入れをする場所、工具の収納を確認しましょう。",
    storage: "軽トラックの荷台横で積み下ろしできる幅と、農具の寸法に合う倉庫の間口・高さを確認しましょう。",
    deck: "デッキで何をしたいか、置くもの、階段の位置を整理しましょう。利用方法に応じた荷重・基礎・手すりなどを含めて計画します。",
    entrance: "乗り降りする側のドアと柱の位置、玄関まで人が通る幅、屋根のつながりを確認しましょう。"
  };
  function known(table, value) {
    return Object.prototype.hasOwnProperty.call(table, value) ? value : "undecided";
  }
  function createPlan(input = {}) {
    const selection = { count: known(counts, input.count), stage: known(stages, input.stage), priority: known(priorities, input.priority) };
    const count = counts[selection.count];
    const stage = stages[selection.stage];
    const priority = priorities[selection.priority];
    const customStyle = selection.priority === "custom" && Object.prototype.hasOwnProperty.call(customStyles, input.customStyle) ? input.customStyle : "";
    const styleLabel = customStyles[customStyle] || "";
    const labels = [count.label, stage.label, priority.label].filter(label => !label.includes("未定"));
    return {
      selection,
      customStyle,
      context: labels.length ? "選んだ内容：" + [...labels, styleLabel].filter(Boolean).join(" ／ ") : "",
      title: (selection.count === "undecided" ? "" : count.label + "の") + "相談で確認したいこと",
      points: [count.tip, stage.tip, customTips[customStyle] || priority.tip],
      message: [count.message, stage.message, priority.message, styleLabel ? "参考ギャラリーの「" + styleLabel + "」が気になっています。" : "", "愛車と使い方に合うプラン、工事込みの費用を相談したいです。"].filter(Boolean).join("\n")
    };
  }
  window.CarportPlanner = Object.freeze({ createPlan });
})();
