import { initializeTelegramBoundary } from './telegram-webapp.js';
import { findRoute, routes } from './routes.js';

const root = document.querySelector('#app-root');
const nav = document.querySelector('[data-bottom-nav]');
const runtimePill = document.querySelector('[data-runtime-pill]');

const runtime = initializeTelegramBoundary();
const context = {
  runtimeLabel: runtime.runtime === 'telegram' ? 'Telegram WebView' : 'Browser preview',
  viewportHeight: Math.round(runtime.viewportHeight),
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
    .map(
      (route) => `
        <button class="nav-item ${route.id === activeRoute.id ? 'active' : ''}" type="button" data-path="${route.path}" aria-current="${route.id === activeRoute.id ? 'page' : 'false'}">
          <span aria-hidden="true">${route.icon}</span>
          <strong>${route.label}</strong>
        </button>
      `
    )
    .join('');
}

function render() {
  const route = findRoute(getCurrentPath());
  document.title = `${route.title} - Adnet Mini App`;
  root.innerHTML = route.render(context);
  renderNavigation(route);
  root.focus({ preventScroll: true });
}

nav.addEventListener('click', (event) => {
  const button = event.target.closest('[data-path]');
  if (!button) return;
  navigate(button.dataset.path);
});

window.addEventListener('hashchange', render);

render();
