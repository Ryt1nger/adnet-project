import { initializeTelegramBoundary } from './telegram-webapp.js';
import { findRoute, getRouteLabel, routes } from './routes.js?v=nav-icons';
import { ROLE_OPTIONS } from './auth/api-contract.js';
import { createAuthClient } from './auth/auth-client.js';
import { createMockAuthAdapter } from './auth/mock-auth-adapter.js?v=nav-icons';
import { canAccessRoute, getAccessRedirect } from './auth/rbac.js?v=nav-icons';
import { createSessionStore } from './auth/session-store.js';

const root = document.querySelector('#app-root');
const nav = document.querySelector('[data-bottom-nav]');
const navIndicator = document.createElement('span');
const THEME_STORAGE_KEY = 'adnet.miniApp.theme';
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
};

const context = {
  runtimeLabel: '',
  viewportHeight: Math.round(runtime.viewportHeight),
  auth: state.auth,
  authLabel: 'Проверяем вход',
  authHint: 'Подготавливаем ваш рабочий экран.',
  roleOptions: ROLE_OPTIONS,
  theme: state.theme,
};

applyTheme(state.theme);

function getCurrentPath() {
  const hash = window.location.hash.replace(/^#/, '');
  return hash || '/';
}

function navigate(path) {
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
  return `
    <button class="nav-item ${route.id === activeRoute.id ? 'active' : ''}" type="button" data-path="${route.path}" aria-current="${route.id === activeRoute.id ? 'page' : 'false'}" style="--nav-slot: ${route.navSlot?.[activeRole] ?? route.navSlot ?? 1}">
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
        <path d="M7.5 5.5h9A2.5 2.5 0 0 1 19 8v10.5H5V8a2.5 2.5 0 0 1 2.5-2.5Z" />
        <path d="M8 10h8" />
        <path d="M8 14h5" />
      </svg>
    `,
    deals: `
      <svg viewBox="0 0 24 24">
        <path d="M7.2 13.2 10.8 17a2.1 2.1 0 0 0 3 0l3-3" />
        <path d="M8 12 5.7 9.7a2.2 2.2 0 0 1 0-3.1 2.2 2.2 0 0 1 3.1 0L12 9.8l3.2-3.2a2.2 2.2 0 0 1 3.1 3.1L16 12" />
      </svg>
    `,
    profile: `
      <svg viewBox="0 0 24 24">
        <path d="M12 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
        <path d="M5.5 19a6.5 6.5 0 0 1 13 0" />
      </svg>
    `,
    settings: `
      <svg viewBox="0 0 24 24">
        <path d="M12 8.5v-3" />
        <path d="M12 18.5v-3" />
        <path d="M7.5 12h-3" />
        <path d="M19.5 12h-3" />
        <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
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
  }
});

function handleAuthAction(action) {
  if (action === 'telegram' || action === 'retry-auth') authenticateWithTelegram();
  if (action === 'logout') logout();
  if (action === 'go-auth') navigate('/auth');
}

window.addEventListener('hashchange', render);
window.addEventListener('resize', updateNavIndicator);

restoreSession();
