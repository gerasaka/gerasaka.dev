export interface Toast {
  id: number;
  title: string;
  description?: string;
}

export interface ToastOptions {
  description?: string;
  duration?: number;
}

interface Timer {
  handle?: ReturnType<typeof setTimeout>;
  start: number;
  remaining: number;
}

let nextId = 0;
const timers = new Map<number, Timer>();

export function useToast() {
  const toasts = useState<Toast[]>('toasts', () => []);

  function dismiss(id: number) {
    clearTimeout(timers.get(id)?.handle);
    timers.delete(id);
    toasts.value = toasts.value.filter((toast) => toast.id !== id);
  }

  function run(id: number, timer: Timer) {
    timer.start = Date.now();
    timer.handle = setTimeout(() => dismiss(id), timer.remaining);
  }

  function toast(title: string, { description, duration = 5000 }: ToastOptions = {}) {
    const id = nextId++;
    toasts.value = [...toasts.value, { id, title, description }];
    const timer: Timer = { start: 0, remaining: duration };
    timers.set(id, timer);
    run(id, timer);
    return id;
  }

  /* While the stack is expanded nobody should lose a message mid-read. */
  function pause() {
    for (const timer of timers.values()) {
      clearTimeout(timer.handle);
      timer.handle = undefined;
      timer.remaining -= Date.now() - timer.start;
    }
  }

  function resume() {
    for (const [id, timer] of timers) {
      if (!timer.handle) run(id, timer);
    }
  }

  return { toasts, toast, dismiss, pause, resume };
}
