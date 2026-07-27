import { initializeTelegramBoundary } from './telegram-webapp.js';
import { findRoute, getRouteLabel, routes } from './routes.js?v=settings-accordion';
import { ROLE_OPTIONS } from './auth/api-contract.js';
import { createAuthClient } from './auth/auth-client.js';
import { createMockAuthAdapter } from './auth/mock-auth-adapter.js?v=settings-accordion';
import { canAccessRoute, getAccessRedirect } from './auth/rbac.js?v=settings-accordion';
import { createSessionStore } from './auth/session-store.js';

const root = document.querySelector('#app-root');
const nav = document.querySelector('[data-bottom-nav]');
const navIndicator = document.createElement('span');
const THEME_STORAGE_KEY = 'adnet.miniApp.theme';
const SETTINGS_PREFS_STORAGE_KEY = 'adnet.miniApp.settingsPrefs';
const THEME_OPTIONS = ['dark', 'light'];

navIndicator.className = 'nav-focus-indicator';
navIndicator.setAttribute('aria-hidden', 'true');

const runtime = initializeTelegramBoundary();
const authClient = createAuthClient({
  adapter: createMockAuthAdapter(),
  store: createSessionStore(),
});

const state = {
  auth: {
    status: 'checking',
    me: null,
    errorMessage: '',
  },
  theme: readSavedTheme(),
  settingsPrefs: readSavedSettingsPrefs(),
  settingsPanel: '',
  confirmAction: '',
};

const context = {
  runtimeLabel: '',
  viewportHeight: Math.round(runtime.viewportHeight),
  auth: state.auth,
  authLabel: 'Проверяем вход',
  authHint: 'Подготавливаем ваш рабочий экран.',
  roleOptions: ROLE_OPTIONS,
  theme: state.theme,
  settingsPrefs: state.settingsPrefs,
  settingsPanel: state.settingsPanel,
  confirmAction: state.confirmAction,
};

applyTheme(state.theme);

function getCurrentPath() {
  const hash = window.location.hash.replace(/^#/, '');
  return hash || '/';
}

function navigate(path) {
  state.settingsPanel = '';
  state.confirmAction = '';

  if (getCurrentPath() === path) {
    render();
    return;
  }

  window.location.hash = path;
}

function renderNavigation(activeRoute) {
  const activeRole = state.auth.me?.activeRole;
  const navRoutes = routes
    .filter((route) => route.nav !== false)
    .filter((route) => canAccessRoute(route, state.auth));

  nav.classList.toggle('is-hidden', !activeRole);
  nav.classList.toggle('is-advertiser', activeRole === 'advertiser');
  nav.classList.toggle('is-creator', activeRole === 'creator');

  if (!activeRole) {
    nav.innerHTML = '';
    return;
  }

  const items = navRoutes.map((route) => renderNavItem(route, activeRoute, activeRole));

  if (activeRole === 'advertiser') {
    items.splice(2, 0, renderCreateAction());
  }

  nav.innerHTML = items.join('');
  nav.prepend(navIndicator);
  updateNavIndicator();
}

function renderNavItem(route, activeRoute, activeRole) {
  const isActive = route.id === activeRoute.id || (activeRoute.id.startsWith('settings-') && route.id === 'settings');

  return `
    <button class="nav-item ${isActive ? 'active' : ''}" type="button" data-path="${route.path}" aria-current="${isActive ? 'page' : 'false'}" style="--nav-slot: ${route.navSlot?.[activeRole] ?? route.navSlot ?? 1}">
      <span aria-hidden="true">${renderNavIcon(route.id)}</span>
      <strong>${getRouteLabel(route, activeRole)}</strong>
    </button>
  `;
}

function renderCreateAction() {
  return `
    <button class="nav-create" type="button" data-nav-action="create" aria-label="Новая задача" style="--nav-slot: 3">
      <span aria-hidden="true">+</span>
    </button>
  `;
}

function renderNavIcon(routeId) {
  const icons = {
    orders: `
      <svg viewBox="0 0 24 24">
        <path d="M7 4.75h7.1L18 8.65v9.6a1.75 1.75 0 0 1-1.75 1.75H7.75A1.75 1.75 0 0 1 6 18.25V6.5A1.75 1.75 0 0 1 7.75 4.75Z" />
        <path d="M14 4.9V8.8h3.85" />
        <path d="M9 12h6" />
        <path d="M9 15.5h5" />
      </svg>
    `,
    deals: `
      <svg viewBox="0 0 24 24">
        <path d="M8.25 8V6.75A1.75 1.75 0 0 1 10 5h4a1.75 1.75 0 0 1 1.75 1.75V8" />
        <path d="M5.75 8h12.5A1.75 1.75 0 0 1 20 9.75v7.5A1.75 1.75 0 0 1 18.25 19H5.75A1.75 1.75 0 0 1 4 17.25v-7.5A1.75 1.75 0 0 1 5.75 8Z" />
        <path d="M4 12.25h16" />
        <path d="M10 12.25v1.25h4v-1.25" />
      </svg>
    `,
    profile: `
      <svg viewBox="0 0 24 24">
        <path d="M12 11.75a3.6 3.6 0 1 0 0-7.2 3.6 3.6 0 0 0 0 7.2Z" />
        <path d="M5.75 19.25a6.25 6.25 0 0 1 12.5 0" />
      </svg>
    `,
    settings: `
      <svg viewBox="0 0 24 24">
        <path d="M5 7h8" />
        <path d="M17 7h2" />
        <path d="M5 12h3" />
        <path d="M12 12h7" />
        <path d="M5 17h7" />
        <path d="M16 17h3" />
        <path d="M13 5.5v3" />
        <path d="M9 10.5v3" />
        <path d="M13 15.5v3" />
      </svg>
    `,
  };

  return icons[routeId] ?? icons.orders;
}

function updateNavIndicator() {
  window.requestAnimationFrame(() => {
    const activeItem = nav.querySelector('.nav-item.active');
    if (!activeItem || nav.classList.contains('is-hidden')) return;
    const activeBox = activeItem.getBoundingClientRect();
    const navBox = nav.getBoundingClientRect();

    nav.style.setProperty('--nav-indicator-x', `${activeBox.left - navBox.left}px`);
    nav.style.setProperty('--nav-indicator-width', `${activeBox.width}px`);
  });
}

function render() {
  let route = findRoute(getCurrentPath());
  const redirect = getAccessRedirect(route, state.auth);
  if (redirect && redirect !== route.path) {
    route = findRoute(redirect);
    window.location.hash = redirect;
  }

  syncContext();
  document.title = `${route.title} - Adnet`;
  root.innerHTML =
    route.access?.auth && state.auth.status === 'checking'
      ? renderGuardLoading()
      : route.render(context);
  renderNavigation(route);
  root.focus({ preventScroll: true });
}

function readSavedTheme() {
  try {
    const savedTheme = window.localStorage?.getItem(THEME_STORAGE_KEY);
    return THEME_OPTIONS.includes(savedTheme) ? savedTheme : 'dark';
  } catch {
    return 'dark';
  }
}

function readSavedSettingsPrefs() {
  const defaults = {
    notifications: {
      orders: true,
      deals: true,
      payments: true,
      service: true,
      quiet: false,
    },
    language: 'ru',
    region: 'ru',
  };

  try {
    const savedPrefs = JSON.parse(window.localStorage?.getItem(SETTINGS_PREFS_STORAGE_KEY) ?? '{}');
    return {
      ...defaults,
      ...savedPrefs,
      notifications: {
        ...defaults.notifications,
        ...(savedPrefs.notifications ?? {}),
      },
    };
  } catch {
    return defaults;
  }
}

function persistSettingsPrefs() {
  try {
    window.localStorage?.setItem(SETTINGS_PREFS_STORAGE_KEY, JSON.stringify(state.settingsPrefs));
  } catch {
    // Local preferences are an enhancement; controls remain usable during the current session.
  }
}

function setTheme(theme) {
  if (!THEME_OPTIONS.includes(theme)) return;
  state.theme = theme;
  applyTheme(theme);

  try {
    window.localStorage?.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Theme persistence is a local enhancement; the app stays usable without storage.
  }

  syncContext();
  render();
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

async function restoreSession() {
  await runAuthAction(async () => {
    const restoredSession = await authClient.restoreSession();
    if (restoredSession.status !== 'anonymous') return restoredSession;
    return authClient.authenticateWithTelegram(runtime.initData ?? '');
  });
}

async function authenticateWithTelegram() {
  await runAuthAction(async () => authClient.authenticateWithTelegram(runtime.initData ?? ''));
  if (state.auth.status === 'role_required') navigate('/role');
}

async function selectRole(role) {
  await runAuthAction(async () => authClient.selectRole(role));
  navigate('/');
}

async function logout() {
  await runAuthAction(async () => authClient.logout());
  navigate('/auth');
}

async function runAuthAction(action) {
  state.auth = {
    status: 'checking',
    me: state.auth.me,
    errorMessage: '',
  };
  syncContext();
  render();

  try {
    state.auth = await action();
  } catch (error) {
    state.auth = {
      status: 'error',
      me: null,
      errorMessage: error instanceof Error ? error.message : 'Неизвестная ошибка входа',
    };
  }

  syncContext();
  render();
}

function syncContext() {
  context.auth = state.auth;
  context.authLabel = getAuthLabel();
  context.authHint = getAuthHint();
  context.theme = state.theme;
  context.settingsPrefs = state.settingsPrefs;
  context.settingsPanel = state.settingsPanel;
  context.confirmAction = state.confirmAction;
}

function getAuthLabel() {
  if (state.auth.status === 'checking') return 'Проверяем вход';
  if (state.auth.status === 'anonymous') return 'Войдите в аккаунт';
  if (state.auth.status === 'role_required') return 'Выберите роль';
  if (state.auth.status === 'error') return 'Нужна повторная попытка';
  if (state.auth.me?.activeRole === 'creator') return 'Вы вошли как исполнитель';
  if (state.auth.me?.activeRole === 'advertiser') return 'Вы вошли как рекламодатель';
  return 'Вход выполнен';
}

function getAuthHint() {
  if (state.auth.status === 'anonymous') return 'Вход откроет ваши заказы и сохраненные площадки.';
  if (state.auth.status === 'role_required') return 'Выберите формат работы, чтобы продолжить.';
  if (state.auth.status === 'error') return 'Проверьте соединение и попробуйте снова.';
  if (state.auth.me?.activeRole) return 'Ваши рабочие разделы готовы.';
  return 'Подготавливаем ваш рабочий экран.';
}

function renderGuardLoading() {
  return `
    <section class="states-list" aria-label="Проверка доступа">
      <article class="state-card state-loading">
        <div class="state-visual" aria-hidden="true"></div>
        <div>
          <h2>Проверяем доступ</h2>
          <p>Подготавливаем ваш рабочий экран.</p>
        </div>
      </article>
    </section>
  `;
}

nav.addEventListener('click', (event) => {
  const actionButton = event.target.closest('[data-nav-action]');
  if (actionButton?.dataset.navAction === 'create') {
    navigate('/create');
    return;
  }

  const button = event.target.closest('[data-path]');
  if (!button) return;
  navigate(button.dataset.path);
});

root.addEventListener('click', (event) => {
  const authButton = event.target.closest('[data-auth-action]');
  if (authButton) {
    handleAuthAction(authButton.dataset.authAction);
    return;
  }

  const roleButton = event.target.closest('[data-role]');
  if (roleButton) {
    selectRole(roleButton.dataset.role);
    return;
  }

  const routeButton = event.target.closest('[data-route]');
  if (routeButton) {
    navigate(routeButton.dataset.route);
    return;
  }

  const themeButton = event.target.closest('[data-theme-choice]');
  if (themeButton) {
    setTheme(themeButton.dataset.themeChoice);
    return;
  }

  const settingsToggle = event.target.closest('[data-setting-toggle]');
  if (settingsToggle) {
    toggleSetting(settingsToggle.dataset.settingToggle);
    return;
  }

  const settingsChoice = event.target.closest('[data-setting-choice]');
  if (settingsChoice) {
    chooseSetting(settingsChoice.dataset.settingChoice, settingsChoice.dataset.settingValue);
    return;
  }

  const settingsPanel = event.target.closest('[data-settings-panel]');
  if (settingsPanel) {
    state.settingsPanel = settingsPanel.dataset.settingsPanel;
    state.confirmAction = '';
    syncContext();
    render();
    return;
  }

  if (event.target.closest('[data-settings-panel-close]')) {
    state.settingsPanel = '';
    syncContext();
    render();
    return;
  }

  const confirmButton = event.target.closest('[data-confirm-action]');
  if (confirmButton) {
    state.confirmAction = confirmButton.dataset.confirmAction;
    syncContext();
    render();
    return;
  }

  if (event.target.closest('[data-confirm-cancel]')) {
    state.confirmAction = '';
    syncContext();
    render();
    return;
  }

  const confirmAccept = event.target.closest('[data-confirm-accept]');
  if (confirmAccept) {
    handleConfirmedAction(confirmAccept.dataset.confirmAccept);
  }
});

function toggleSetting(key) {
  if (!Object.hasOwn(state.settingsPrefs.notifications, key)) return;
  state.settingsPrefs = {
    ...state.settingsPrefs,
    notifications: {
      ...state.settingsPrefs.notifications,
      [key]: !state.settingsPrefs.notifications[key],
    },
  };
  persistSettingsPrefs();
  syncContext();
  render();
}

function chooseSetting(key, value) {
  if (!['language', 'region'].includes(key)) return;
  state.settingsPrefs = {
    ...state.settingsPrefs,
    [key]: value,
  };
  persistSettingsPrefs();
  syncContext();
  render();
}

function handleConfirmedAction(action) {
  if (action === 'logout') {
    logout();
    return;
  }

  if (action === 'role') {
    state.confirmAction = '';
    navigate('/role');
  }
}

function handleAuthAction(action) {
  if (action === 'telegram' || action === 'retry-auth') authenticateWithTelegram();
  if (action === 'logout') logout();
  if (action === 'go-auth') navigate('/auth');
}

window.addEventListener('hashchange', render);
window.addEventListener('resize', updateNavIndicator);

restoreSession();
