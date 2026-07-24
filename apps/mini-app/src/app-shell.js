import { initializeTelegramBoundary } from './telegram-webapp.js';
import { findRoute, routes } from './routes.js';
import { ROLE_OPTIONS } from './auth/api-contract.js';
import { createAuthClient } from './auth/auth-client.js';
import { createMockAuthAdapter } from './auth/mock-auth-adapter.js';
import { canAccessRoute, getAccessRedirect } from './auth/rbac.js';
import { createSessionStore } from './auth/session-store.js';

const root = document.querySelector('#app-root');
const nav = document.querySelector('[data-bottom-nav]');
const runtimePill = document.querySelector('[data-runtime-pill]');

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
  runtimeLabel: runtime.runtime === 'telegram' ? 'Telegram WebView' : 'Browser preview',
  viewportHeight: Math.round(runtime.viewportHeight),
  auth: state.auth,
  authLabel: 'Checking session',
  roleOptions: ROLE_OPTIONS,
};

runtimePill.textContent = context.runtimeLabel;

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
  nav.innerHTML = routes
    .filter((route) => route.nav !== false)
    .map(
      (route) => `
        <button class="nav-item ${route.id === activeRoute.id ? 'active' : ''}" type="button" data-path="${route.path}" aria-current="${route.id === activeRoute.id ? 'page' : 'false'}" ${canAccessRoute(route, state.auth) ? '' : 'data-locked="true"'}>
          <span aria-hidden="true">${route.icon}</span>
          <strong>${route.label}</strong>
        </button>
      `
    )
    .join('');
}

function render() {
  let route = findRoute(getCurrentPath());
  const redirect = getAccessRedirect(route, state.auth);
  if (redirect && redirect !== route.path) {
    route = findRoute(redirect);
    window.location.hash = redirect;
  }

  syncContext();
  document.title = `${route.title} - Adnet Mini App`;
  root.innerHTML =
    route.access?.auth && state.auth.status === 'checking'
      ? renderGuardLoading()
      : route.render(context);
  renderNavigation(route);
  root.focus({ preventScroll: true });
}

async function restoreSession() {
  await runAuthAction(async () => authClient.restoreSession());
}

async function authenticateWithTelegram() {
  await runAuthAction(async () => authClient.authenticateWithTelegram(runtime.initData ?? ''));
  if (state.auth.status === 'role_required') navigate('/role');
}

async function selectRole(role) {
  await runAuthAction(async () => authClient.selectRole(role));
  navigate('/workspace');
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
      errorMessage: error instanceof Error ? error.message : 'Unknown auth error',
    };
  }

  syncContext();
  render();
}

function syncContext() {
  context.auth = state.auth;
  context.authLabel = getAuthLabel();
}

function getAuthLabel() {
  if (state.auth.status === 'checking') return 'Checking session';
  if (state.auth.status === 'anonymous') return 'Anonymous';
  if (state.auth.status === 'role_required') return 'Role required';
  if (state.auth.status === 'error') return 'Auth error';
  return state.auth.me?.activeRole ? `Ready as ${state.auth.me.activeRole}` : 'Ready';
}

function renderGuardLoading() {
  return `
    <section class="states-list" aria-label="Protected route loading state">
      <article class="state-card state-loading">
        <div class="state-visual" aria-hidden="true"></div>
        <div>
          <h2>Проверяем доступ</h2>
          <p>Сначала восстанавливаем сессию и /me, затем пропускаем пользователя в защищенный route.</p>
        </div>
      </article>
    </section>
  `;
}

nav.addEventListener('click', (event) => {
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
