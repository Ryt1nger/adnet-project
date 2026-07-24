const STORAGE_KEY = 'adnet.miniApp.sessionToken';

export function createSessionStore(storage = window.localStorage) {
  return {
    read() {
      return storage.getItem(STORAGE_KEY);
    },
    write(sessionToken) {
      storage.setItem(STORAGE_KEY, sessionToken);
    },
    clear() {
      storage.removeItem(STORAGE_KEY);
    },
  };
}
