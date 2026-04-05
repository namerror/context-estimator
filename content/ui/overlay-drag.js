(() => {
  const content = window.__ccxContent;
  if (!content) return;

  function noop() {}

  function attachOverlayDrag({
    root,
    handle,
    thresholdPx,
    getPosition,
    applyPosition,
    persistPosition
  }) {
    if (!root || !handle) {
      return {
        syncToViewport: noop,
        destroy: noop
      };
    }

    const threshold = Number.isFinite(thresholdPx) ? thresholdPx : 0;
    const body = root.ownerDocument?.body || document.body;
    let dragState = null;
    let suppressNextClick = false;

    const readPosition = () => {
      const position = typeof getPosition === "function" ? getPosition() : null;
      return {
        right: Number.isFinite(position?.right) ? position.right : 0,
        bottom: Number.isFinite(position?.bottom) ? position.bottom : 0
      };
    };

    const syncToViewport = (persist = false) => {
      const before = readPosition();
      if (typeof applyPosition === "function") {
        applyPosition(before);
      }
      const after = readPosition();
      if (persist && (before.right !== after.right || before.bottom !== after.bottom)) {
        persistPosition?.(after);
      }
    };

    const cleanupDragClasses = () => {
      root.classList.remove("ccx-dragging");
      body?.classList.remove("ccx-no-select");
    };

    const stopDrag = (persist) => {
      if (!dragState) {
        cleanupDragClasses();
        return;
      }

      const { pointerId, moved } = dragState;
      if (handle.hasPointerCapture?.(pointerId)) {
        handle.releasePointerCapture(pointerId);
      }

      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerCancel);

      cleanupDragClasses();

      const finalPosition = readPosition();
      dragState = null;

      if (moved) {
        suppressNextClick = true;
        if (persist) {
          persistPosition?.(finalPosition);
        }
      }
    };

    const onPointerMove = (event) => {
      if (!dragState || event.pointerId !== dragState.pointerId) return;

      const dx = event.clientX - dragState.startX;
      const dy = event.clientY - dragState.startY;
      if (!dragState.moved && Math.hypot(dx, dy) < threshold) return;

      dragState.moved = true;
      root.classList.add("ccx-dragging");
      body?.classList.add("ccx-no-select");

      applyPosition?.({
        right: dragState.startPosition.right - dx,
        bottom: dragState.startPosition.bottom - dy
      });
    };

    const onPointerUp = (event) => {
      if (!dragState || event.pointerId !== dragState.pointerId) return;
      stopDrag(true);
    };

    const onPointerCancel = (event) => {
      if (!dragState || event.pointerId !== dragState.pointerId) return;
      stopDrag(false);
    };

    const onPointerDown = (event) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;

      dragState = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        startPosition: readPosition(),
        moved: false
      };

      handle.setPointerCapture?.(event.pointerId);
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
      window.addEventListener("pointercancel", onPointerCancel);
    };

    const onClickCapture = (event) => {
      if (!suppressNextClick) return;
      suppressNextClick = false;
      event.preventDefault();
      event.stopPropagation();
    };

    const onResize = () => {
      syncToViewport(false);
    };

    handle.addEventListener("pointerdown", onPointerDown);
    handle.addEventListener("click", onClickCapture, true);
    window.addEventListener("resize", onResize);

    syncToViewport(false);

    return {
      syncToViewport,
      destroy() {
        stopDrag(false);
        handle.removeEventListener("pointerdown", onPointerDown);
        handle.removeEventListener("click", onClickCapture, true);
        window.removeEventListener("resize", onResize);
      }
    };
  }

  content.ui.attachOverlayDrag = attachOverlayDrag;
})();
