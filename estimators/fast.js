(() => {
  const registry = window.__ccxEstimatorRegistry;
  if (!registry) return;

  function estimateTokensHeuristic(text, modelId) {
    const chars = text.length;
    let charsPerToken = 4;
    if (modelId.startsWith("gpt-4")) charsPerToken = 3.8;
    if (modelId.startsWith("gpt-3")) charsPerToken = 4;
    const tokens = Math.ceil(chars / charsPerToken);
    return Math.max(tokens, 0);
  }

  function estimateTokensPrecise(text, tokenizer) {
    if (!tokenizer || typeof tokenizer.encode !== "function") return null;
    try {
      return tokenizer.encode(text).length;
    } catch {
      return null;
    }
  }

  registry.registerEstimator({
    id: "fast",
    label: "Fast estimation",
    estimate({ text, modelId, tokenizer }) {
      const safeText = typeof text === "string" ? text : "";
      const safeModel = typeof modelId === "string" ? modelId : "";
      const precise = estimateTokensPrecise(safeText, tokenizer);
      if (typeof precise === "number") return { chatTokens: precise };
      return { chatTokens: estimateTokensHeuristic(safeText, safeModel) };
    }
  });
})();
