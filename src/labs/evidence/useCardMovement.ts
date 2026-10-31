import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react';

type Gesture = {
  id: string;
  pointer: number;
  x: number;
  y: number;
  moved: boolean;
  handle: HTMLButtonElement;
};

export function useCardMovement(move: (id: string, target: string) => void, active: boolean) {
  const [dragging, setDragging] = useState<string | null>(null);
  const [over, setOver] = useState<string | null>(null);
  const gesture = useRef<Gesture | null>(null);
  const suppressClick = useRef(false);
  const frame = useRef(0);
  const point = useRef({ x: 0, y: 0 });

  const release = useCallback(() => {
    cancelAnimationFrame(frame.current);
    frame.current = 0;
    const previous = gesture.current;
    gesture.current = null;
    if (previous?.handle.hasPointerCapture(previous.pointer)) {
      previous.handle.releasePointerCapture(previous.pointer);
    }
  }, []);

  const cancel = useCallback(() => {
    release();
    setDragging(null);
    setOver(null);
    suppressClick.current = false;
  }, [release]);

  useEffect(() => {
    if (!active) {
      cancel();
      return;
    }
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && gesture.current) {
        event.preventDefault();
        cancel();
      }
    };
    const hidden = () => {
      if (document.hidden) cancel();
    };
    window.addEventListener('keydown', escape);
    window.addEventListener('blur', cancel);
    document.addEventListener('visibilitychange', hidden);
    return () => {
      window.removeEventListener('keydown', escape);
      window.removeEventListener('blur', cancel);
      document.removeEventListener('visibilitychange', hidden);
      release();
    };
  }, [active, cancel, release]);

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
    onPointerDown: (event: PointerEvent<HTMLButtonElement>) => {
      if (!active || !event.isPrimary || event.button !== 0) return;
      event.preventDefault();
      cancel();
      try {
        event.currentTarget.setPointerCapture(event.pointerId);
        gesture.current = {
          id,
          pointer: event.pointerId,
          x: event.clientX,
          y: event.clientY,
          moved: false,
          handle: event.currentTarget,
        };
      } catch {
        // Without capture, a release outside the handle would be unreliable. Menus remain available.
      }
    },
    onPointerMove: (event: PointerEvent<HTMLButtonElement>) => {
      const current = gesture.current;
      if (!current || current.pointer !== event.pointerId) return;
      if (Math.hypot(event.clientX - current.x, event.clientY - current.y) > 8)
        current.moved = true;
      if (current.moved) {
        point.current = { x: event.clientX, y: event.clientY };
        setDragging(id);
        setOver(targetAt(event.clientX, event.clientY));
        if (!frame.current) frame.current = requestAnimationFrame(scrollWhileDragging);
      }
    },
    onPointerUp: (event: PointerEvent<HTMLButtonElement>) => {
      const current = gesture.current;
      if (!current || current.pointer !== event.pointerId) return;
      const target = current.moved ? targetAt(event.clientX, event.clientY) : null;
      const moved = current.moved;
      cancel();
      suppressClick.current = moved;
      if (target) move(current.id, target);
    },
    onLostPointerCapture: () => {
      if (gesture.current) cancel();
    },
    onPointerCancel: cancel,
    onClick: () => {
      if (suppressClick.current) {
        suppressClick.current = false;
        return;
      }
      document.getElementById('place-' + id)?.focus();
    },
  });
  const zone = (target: string) => ({ 'data-evidence-target': target });
  return { dragging: active ? dragging : null, over: active ? over : null, handle, zone };
}
