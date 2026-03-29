(() => {
  const registry = window.__ccxEstimatorRegistry;
  if (!registry) return;

  function estimateTokensWithTokenizer(text, modelId, tokenizer) {
    if (!tokenizer) return null;
    if (typeof tokenizer.count === "function") {
      const counted = tokenizer.count(text, modelId);
      return Number.isFinite(counted) ? counted : null;
    }
    if (typeof tokenizer.encode === "function") {
      try {
        const encoded = tokenizer.encode(text);
        return Array.isArray(encoded) ? encoded.length : null;
      } catch {
        return null;
      }
    }
    return null;
  }

  registry.registerEstimator({
    id: "precise",
    label: "Precise (tokenizer)",
    estimate({ text, modelId, tokenizer }) {
      const safeText = typeof text === "string" ? text : "";
      const safeModel = typeof modelId === "string" ? modelId : "";
      return { chatTokens: estimateTokensWithTokenizer(safeText, safeModel, tokenizer) };
    }
  });
})();
