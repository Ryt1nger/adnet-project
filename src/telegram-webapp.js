const ADNET_BACKGROUND = '#050706';
const ADNET_HEADER = '#0b0f0c';

export function getTelegramWebApp() {
  return window.Telegram?.WebApp ?? null;
}

export function initializeTelegramBoundary() {
  const webApp = getTelegramWebApp();

  if (!webApp) {
    document.documentElement.dataset.runtime = 'browser';
    return {
      runtime: 'browser',
      viewportHeight: window.innerHeight,
      safeAreaInset: null,
    };
  }

  document.documentElement.dataset.runtime = 'telegram';
  webApp.ready();
  webApp.expand();
  webApp.setBackgroundColor?.(ADNET_BACKGROUND);
  webApp.setHeaderColor?.(ADNET_HEADER);

  applyTelegramTheme(webApp.themeParams ?? {});

  return {
    runtime: 'telegram',
    initData: webApp.initData ?? '',
    initDataUnsafe: webApp.initDataUnsafe ?? null,
    viewportHeight: webApp.viewportStableHeight ?? webApp.viewportHeight ?? window.innerHeight,
    safeAreaInset: webApp.safeAreaInset ?? null,
    colorScheme: webApp.colorScheme ?? 'dark',
  };
}

function applyTelegramTheme(themeParams) {
  const root = document.documentElement;
  const background = themeParams.bg_color;
  const text = themeParams.text_color;
  const hint = themeParams.hint_color;

  if (background) root.style.setProperty('--tg-surface', background);
  if (text) root.style.setProperty('--tg-text', text);
  if (hint) root.style.setProperty('--tg-muted', hint);
}
