import { useEffect, useRef, useState, type PointerEvent } from 'react';
export function useCardMovement(move: (id: string, target: string) => void) {
  const [dragging, setDragging] = useState<string | null>(null),
    [over, setOver] = useState<string | null>(null);
  const gesture = useRef<{
      id: string;
      pointer: number;
      x: number;
      y: number;
      moved: boolean;
    } | null>(null),
    suppressClick = useRef(false),
    frame = useRef(0),
    point = useRef({ x: 0, y: 0 });
  useEffect(() => () => cancelAnimationFrame(frame.current), []);
  const clear = () => {
    cancelAnimationFrame(frame.current);
    frame.current = 0;
    gesture.current = null;
    setDragging(null);
    setOver(null);
  };
  const targetAt = (x: number, y: number) =>
    document.elementFromPoint(x, y)?.closest<HTMLElement>('[data-evidence-target]')?.dataset
      .evidenceTarget || null;
  const scrollWhileDragging = () => {
    if (!gesture.current?.moved) {
      frame.current = 0;
      return;
    }
    const { x, y } = point.current;
    const direction = y < 75 ? -16 : y > window.innerHeight - 75 ? 16 : 0;
    if (direction) window.scrollBy({ top: direction, behavior: 'instant' });
    setOver(targetAt(x, y));
    frame.current = requestAnimationFrame(scrollWhileDragging);
  };
  const handle = (id: string) => ({
    draggable: false,
    onPointerDown: (e: PointerEvent<HTMLButtonElement>) => {
      if (!e.isPrimary || e.button !== 0) return;
      e.preventDefault();
      gesture.current = { id, pointer: e.pointerId, x: e.clientX, y: e.clientY, moved: false };
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        /* Synthetic tests and cancelled pointers may not have capture. */
      }
    },
    onPointerMove: (e: PointerEvent<HTMLButtonElement>) => {
      const g = gesture.current;
      if (!g || g.pointer !== e.pointerId) return;
      if (Math.hypot(e.clientX - g.x, e.clientY - g.y) > 8) g.moved = true;
      if (g.moved) {
        point.current = { x: e.clientX, y: e.clientY };
        setDragging(id);
        setOver(targetAt(e.clientX, e.clientY));
        if (!frame.current) frame.current = requestAnimationFrame(scrollWhileDragging);
      }
    },
    onPointerUp: (e: PointerEvent<HTMLButtonElement>) => {
      const g = gesture.current;
      if (!g || g.pointer !== e.pointerId) return;
      const target = g.moved ? targetAt(e.clientX, e.clientY) : null;
      suppressClick.current = g.moved;
      if (e.currentTarget.hasPointerCapture(e.pointerId))
        e.currentTarget.releasePointerCapture(e.pointerId);
      clear();
      if (target) move(g.id, target);
    },
    onPointerCancel: clear,
    onClick: () => {
      if (suppressClick.current) {
        suppressClick.current = false;
        return;
      }
      document.querySelector<HTMLSelectElement>(`[data-card-select="${id}"]`)?.focus();
    },
  });
  const zone = (target: string) => ({ 'data-evidence-target': target });
  return { dragging, over, handle, zone };
}
