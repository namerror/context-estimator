(() => {
  if (window.__ccxTokenizer) return;

  function getEncodingForModel(modelId) {
    const id = String(modelId || "").toLowerCase();

    if (id === "gpt-4" || id === "gpt-4-32k" || id === "gpt-3.5") return "cl100k_base";

    if (id.startsWith("gpt-4o")) return "o200k_base";
    if (id.startsWith("gpt-4.1")) return "o200k_base";
    if (id.startsWith("gpt-5")) return "o200k_base";
    if (id.startsWith("o1")) return "o200k_base";
    if (id === "o3") return "o200k_base";

    if (id.startsWith("gpt-4")) return "cl100k_base";

    return "o200k_base";
  }

  function getTokenizerModule(encoding) {
    const key = `GPTTokenizer_${encoding}`;
    const mod = window[key];
    if (!mod || typeof mod.encode !== "function") return null;
    return mod;
  }

  function count(text, modelId) {
    if (typeof text !== "string") return null;
    const encoding = getEncodingForModel(modelId);
    const mod = getTokenizerModule(encoding);
    if (!mod) return null;
    try {
      const encoded = mod.encode(text);
      return Array.isArray(encoded) ? encoded.length : null;
    } catch {
      return null;
    }
  }

  window.__ccxTokenizer = {
    getEncodingForModel,
    count
  };
})();

