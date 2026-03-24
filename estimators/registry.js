(() => {
  if (window.__ccxEstimatorRegistry) return;

  const estimators = new Map();

  function registerEstimator(estimator) {
    if (!estimator || !estimator.id || typeof estimator.estimate !== "function") return;
    estimators.set(estimator.id, estimator);
  }

  function getEstimator(id) {
    return estimators.get(id) || null;
  }

  function listEstimators() {
    return Array.from(estimators.values());
  }

  window.__ccxEstimatorRegistry = {
    registerEstimator,
    getEstimator,
    listEstimators
  };
})();
