const callbacks = {};

export function registerCallback(id, fn) {
  callbacks[id] = fn;
}

export function resolveCallback(id, data) {
  callbacks[id]?.(data);
  delete callbacks[id];
}