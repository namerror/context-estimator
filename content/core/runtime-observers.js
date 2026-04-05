(() => {
  const content = window.__ccxContent;
  if (!content) return;

  function noop() {}

  function createScheduler({ delayMs, onRun }) {
    const delay = Number.isFinite(delayMs) ? delayMs : 0;
    let timer = null;

    return {
      schedule() {
        if (timer) clearTimeout(timer);
        timer = window.setTimeout(() => {
          timer = null;
          onRun?.();
        }, delay);
      },
      cancel() {
        if (!timer) return;
        clearTimeout(timer);
        timer = null;
      },
      destroy() {
        if (!timer) return;
        clearTimeout(timer);
        timer = null;
      }
    };
  }

  function observeDom({ onChange }) {
    const container = document.querySelector("main") || document.body;
    if (!container) {
      return { disconnect: noop };
    }

    const observer = new MutationObserver(() => {
      onChange?.();
    });

    observer.observe(container, {
      childList: true,
      subtree: true,
      characterData: true
    });

    return {
      disconnect() {
        observer.disconnect();
      }
    };
  }

  function observeNavigation({ onChange, pollMs }) {
    const originalMethods = {};
    const wrappedMethods = {};
    let lastKnownUrl = window.location.href;

    const emitChange = () => {
      lastKnownUrl = window.location.href;
      onChange?.();
    };

    const wrapHistoryMethod = (method) => {
      const original = history[method];
      if (typeof original !== "function") return;

      originalMethods[method] = original;
      wrappedMethods[method] = function wrappedHistoryMethod(...args) {
        const result = original.apply(this, args);
        emitChange();
        return result;
      };

      history[method] = wrappedMethods[method];
    };

    wrapHistoryMethod("pushState");
    wrapHistoryMethod("replaceState");

    window.addEventListener("popstate", emitChange);
    window.addEventListener("hashchange", emitChange);

    const intervalId = window.setInterval(() => {
      const currentUrl = window.location.href;
      if (currentUrl === lastKnownUrl) return;
      emitChange();
    }, Number.isFinite(pollMs) ? pollMs : 1000);

    return {
      disconnect() {
        window.removeEventListener("popstate", emitChange);
        window.removeEventListener("hashchange", emitChange);
        window.clearInterval(intervalId);

        for (const method of Object.keys(originalMethods)) {
          if (history[method] === wrappedMethods[method]) {
            history[method] = originalMethods[method];
          }
        }
      }
    };
  }

  content.core.createScheduler = createScheduler;
  content.core.observeDom = observeDom;
  content.core.observeNavigation = observeNavigation;
})();
