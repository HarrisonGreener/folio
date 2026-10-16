/**
 * Auto-fit for large money figures. Any element with `data-fit` keeps its
 * designed size when there is room, and shrinks just enough to fit its row
 * when the number is too long (e.g. £64,631 on a 390px-wide phone).
 */

const MIN_RATIO = 0.45;

const availableWidth = (el: HTMLElement): number => {
  const parent = el.parentElement;
  if (!parent) return el.clientWidth;
  const cs = getComputedStyle(parent);
  let width = parent.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
  const isRow = cs.display.includes('flex') && !cs.flexDirection.startsWith('column');
  if (isRow) {
    const gap = parseFloat(cs.columnGap) || 0;
    for (const sib of Array.from(parent.children) as HTMLElement[]) {
      if (sib === el || getComputedStyle(sib).position === 'absolute') continue;
      width -= sib.offsetWidth + gap;
    }
  }
  return width;
};

const naturalWidth = (el: HTMLElement): number => {
  const range = document.createRange();
  range.selectNodeContents(el);
  const rect = el.getBoundingClientRect();
  // Undo any CSS transform (the desktop phone frame is scaled)
  const scale = el.offsetWidth > 0 && rect.width > 0 ? rect.width / el.offsetWidth : 1;
  return range.getBoundingClientRect().width / (scale || 1);
};

const fitOne = (el: HTMLElement) => {
  el.style.fontSize = '';
  el.style.whiteSpace = 'nowrap';
  const base = parseFloat(getComputedStyle(el).fontSize);
  const avail = availableWidth(el);
  const need = naturalWidth(el);
  if (avail > 0 && need > avail) {
    el.style.fontSize = `${Math.max(base * MIN_RATIO, (base * avail) / need * 0.97)}px`;
  }
};

export const installFitText = (root: HTMLElement) => {
  let queued = false;
  const run = () => {
    queued = false;
    root.querySelectorAll<HTMLElement>('[data-fit]').forEach(fitOne);
  };
  const schedule = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(run);
  };
  new MutationObserver(schedule).observe(root, { childList: true, subtree: true, characterData: true });
  window.addEventListener('resize', schedule);
  document.fonts?.ready.then(schedule);
  schedule();
};
