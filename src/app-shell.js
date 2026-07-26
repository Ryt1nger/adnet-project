import { initializeTelegramBoundary } from './telegram-webapp.js';
import { findRoute, getRouteLabel, routes } from './routes.js?v=product-ui';
import { ROLE_OPTIONS } from './auth/api-contract.js';
import { createAuthClient } from './auth/auth-client.js';
import { createMockAuthAdapter } from './auth/mock-auth-adapter.js?v=product-ui';
import { canAccessRoute, getAccessRedirect } from './auth/rbac.js?v=product-ui';
import { createSessionStore } from './auth/session-store.js';

const root = document.querySelector('#app-root');
const nav = document.querySelector('[data-bottom-nav]');

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
};

const context = {
  runtimeLabel: '',
  viewportHeight: Math.round(runtime.viewportHeight),
  auth: state.auth,
  authLabel: 'Проверяем вход',
  authHint: 'Подготавливаем ваш рабочий экран.',
  roleOptions: ROLE_OPTIONS,
};

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
}

function renderNavItem(route, activeRoute, activeRole) {
  return `
    <button class="nav-item ${route.id === activeRoute.id ? 'active' : ''}" type="button" data-path="${route.path}" aria-current="${route.id === activeRoute.id ? 'page' : 'false'}">
      <span aria-hidden="true">${route.icon}</span>
      <strong>${getRouteLabel(route, activeRole)}</strong>
    </button>
  `;
}

function renderCreateAction() {
  return `
    <button class="nav-create" type="button" data-nav-action="create" aria-label="Новая задача">
      <span aria-hidden="true">+</span>
    </button>
  `;
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
  }
});

function handleAuthAction(action) {
  if (action === 'telegram' || action === 'retry-auth') authenticateWithTelegram();
  if (action === 'logout') logout();
  if (action === 'go-auth') navigate('/auth');
}

window.addEventListener('hashchange', render);

restoreSession();
