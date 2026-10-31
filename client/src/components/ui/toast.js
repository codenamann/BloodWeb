const listeners = new Set();
let idCounter = 0;

export const toast = {
  success: (title, subtitle, duration = 3000) => {
    emit({ id: idCounter++, type: 'success', title, subtitle, duration });
  },
  error: (title, subtitle, duration = 4000) => {
    emit({ id: idCounter++, type: 'error', title, subtitle, duration });
  },
  info: (title, subtitle, duration = 3000) => {
    emit({ id: idCounter++, type: 'info', title, subtitle, duration });
  },
  subscribe: (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }
};

function emit(toastData) {
  listeners.forEach((listener) => listener(toastData));
}
