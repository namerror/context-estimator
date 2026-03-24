(() => {
  const registry = window.__ccxEstimatorRegistry;
  if (!registry) return;

  registry.registerEstimator({
    id: "methodB",
    label: "Method B (placeholder)",
    estimate() {
      return { chatTokens: 1000 };
    }
  });
})();
