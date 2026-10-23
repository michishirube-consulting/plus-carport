// SNS側にはsrcを付けたLPのURLを掲載する。転送先はサイトの固定URLだけ。
(function () {
  const sources = ["instagram", "tiktok", "youtube"];
  const plans = ["one-car", "two-car", "bike", "truck", "deck", "entrance", "custom", "budget"];
  const origin = "https://plus-carport-consult.vercel.app";

  function attribution(search) {
    const input = new URLSearchParams(search);
    const source = input.get("src") ?? input.get("utm_source");
    const result = new URLSearchParams();
    const sns = sources.includes(source) ? source : null;
    result.set("src", sns || "lp");
    if (sns) {
      result.set("utm_source", sns);
      result.set("utm_medium", "social");
    }
    for (const key of ["utm_medium", "utm_campaign", "utm_content", "utm_term"]) {
      const value = input.get(key) || "";
      // 広告・投稿名だけを渡し、メール・電話番号や自由入力は渡さない。
      const digits = value.replace(/\D/g, "");
      if (/^[a-zA-Z][a-zA-Z0-9_.~-]{0,79}$/.test(value) && !/\d{7,}/.test(value) && !/^0\d{9,10}$/.test(digits) && !/^810?\d{9,10}$/.test(digits)) result.set(key, value);
    }
    if (["0", "1"].includes(input.get("metrics_test"))) result.set("metrics_test", input.get("metrics_test"));
    return result;
  }

  window.CarportSourceRouting = {
    consultationUrl(search, plan) {
      const url = new URL("/line/start", origin);
      url.search = attribution(search).toString();
      if (plans.includes(plan)) url.searchParams.set("plan", plan);
      return url.href;
    },
    simulatorUrl(href, search) {
      try {
        const url = new URL(href);
        if (url.origin !== origin || !url.pathname.startsWith("/carport")) return null;
        for (const [key, value] of attribution(search)) url.searchParams.set(key, value);
        return url.href;
      } catch { return null; }
    }
  };
})();
