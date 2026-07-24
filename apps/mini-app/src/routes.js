export const routes = [
  {
    id: 'overview',
    path: '/',
    label: 'Обзор',
    icon: 'A',
    title: 'Foundation shell',
    render: renderOverview,
  },
  {
    id: 'auth',
    path: '/auth',
    label: 'Доступ',
    icon: 'I',
    title: 'Auth boundary',
    render: renderAuth,
  },
  {
    id: 'role',
    path: '/role',
    label: 'Роль',
    icon: 'R',
    title: 'Role selection',
    nav: false,
    access: { auth: true },
    render: renderRoleSelection,
  },
  {
    id: 'workspace',
    path: '/workspace',
    label: 'Работа',
    icon: 'W',
    title: 'Workspace layout',
    access: { auth: true, roles: ['advertiser', 'creator'] },
    render: renderWorkspace,
  },
  {
    id: 'states',
    path: '/states',
    label: 'Состояния',
    icon: 'S',
    title: 'System states',
    render: renderStates,
  },
  {
    id: 'settings',
    path: '/settings',
    label: 'Система',
    icon: 'T',
    title: 'Telegram boundary',
    render: renderSettings,
  },
];

export function findRoute(pathname) {
  return routes.find((route) => route.path === pathname) ?? routes[0];
}

function renderOverview(context) {
  return `
    <section class="hero-panel">
      <p class="eyebrow">Telegram Mini App</p>
      <h1>Визуальная оболочка Adnet</h1>
      <p>Мобильный app shell для будущих модулей: auth, profiles, campaigns, deals, Evidence, review и reports.</p>
      <div class="status-stack">
        <article><span></span><strong>${context.runtimeLabel}</strong><p>SDK boundary готов к запуску внутри Telegram WebView.</p></article>
        <article><span></span><strong>Safe-area layout</strong><p>Нижняя навигация и контент учитывают зоны устройства.</p></article>
        <article><span></span><strong>${context.authLabel}</strong><p>Auth boundary отделяет Telegram identity, session и route guards от будущих бизнес-модулей.</p></article>
      </div>
    </section>
  `;
}

function renderAuth(context) {
  if (context.auth.status === 'checking') {
    return renderAuthState('loading', 'Проверяем сессию', 'Mini App восстанавливает локальный session token и сверяет модель пользователя через /me.');
  }

  if (context.auth.status === 'error') {
    return renderAuthState('error', 'Не удалось открыть доступ', context.auth.errorMessage, 'Повторить', 'retry-auth');
  }

  if (context.auth.me) {
    return `
      <section class="auth-panel">
        <p class="eyebrow">/me model</p>
        <h1>Сессия активна</h1>
        ${renderUserCard(context.auth.me)}
        <div class="action-row">
          <button class="primary-action" type="button" data-route="/role">Управлять ролью</button>
          <button class="ghost-action" type="button" data-auth-action="logout">Выйти</button>
        </div>
      </section>
    `;
  }

  return `
    <section class="auth-panel">
      <p class="eyebrow">Telegram identity</p>
      <h1>Вход через Telegram</h1>
      <p>Frontend передает raw initData на API boundary. Подпись должен проверять сервер, не клиент.</p>
      <button class="primary-action" type="button" data-auth-action="telegram">Продолжить через Telegram</button>
      <p class="system-note">В browser preview используется mock adapter с тем же контрактом ответа.</p>
    </section>
  `;
}

function renderRoleSelection(context) {
  if (!context.auth.me) {
    return renderAuthState('empty', 'Сессия не найдена', 'Сначала нужен Telegram sign-in.', 'Перейти ко входу', 'go-auth');
  }

  return `
    <section class="auth-panel">
      <p class="eyebrow">RBAC setup</p>
      <h1>Выберите рабочую роль</h1>
      ${renderUserCard(context.auth.me)}
      <div class="role-grid">
        ${context.roleOptions
          .map(
            (role) => `
              <button class="role-option ${context.auth.me.activeRole === role.id ? 'active' : ''}" type="button" data-role="${role.id}">
                <span>${role.id === 'advertiser' ? 'AD' : 'CR'}</span>
                <strong>${role.title}</strong>
                <p>${role.description}</p>
              </button>
            `
          )
          .join('')}
      </div>
    </section>
  `;
}

function renderWorkspace(context) {
  const activeRole = context.auth.me?.activeRole ? escapeHtml(context.auth.me.activeRole) : 'Role';

  return `
    <section class="screen-grid" aria-label="Каркас рабочих областей">
      <article class="surface-card surface-card-strong">
        <span class="card-index">01</span>
        <h2>${activeRole} workspace</h2>
        <p>Route guard пропускает сюда только пользователя с выбранной ролью.</p>
      </article>
      <article class="surface-card">
        <span class="card-index">02</span>
        <h2>Route outlet</h2>
        <p>Контейнер для будущих экранов без бизнес-логики в foundation.</p>
      </article>
      <article class="surface-card">
        <span class="card-index">03</span>
        <h2>Bottom navigation</h2>
        <p>Touch-friendly навигация с активным состоянием.</p>
      </article>
    </section>
  `;
}

function renderStates() {
  return `
    <section class="states-list" aria-label="Системные состояния">
      ${renderState('loading', 'Загрузка', 'Скелетон для первого открытия Mini App или перехода между будущими модулями.')}
      ${renderState('empty', 'Пусто', 'Нейтральное состояние для экранов без данных, пока пользователь не начал работу.')}
      ${renderState('error', 'Ошибка', 'Нефатальная ошибка оболочки с понятным повторным действием.')}
    </section>
  `;
}

function renderSettings(context) {
  return `
    <section class="system-panel">
      <p class="eyebrow">Integration boundary</p>
      <h1>Telegram WebApp SDK</h1>
      <dl>
        <div><dt>Runtime</dt><dd>${context.runtimeLabel}</dd></div>
        <div><dt>Viewport</dt><dd>${context.viewportHeight}px</dd></div>
        <div><dt>Auth</dt><dd>${context.authLabel}</dd></div>
        <div><dt>Theme</dt><dd>Dark Adnet tokens with Telegram fallbacks</dd></div>
      </dl>
      <p class="system-note">Auth module задает контракт доступа, но не реализует backend, кампании, сделки или платежи.</p>
    </section>
  `;
}

function renderState(kind, title, text) {
  return `
    <article class="state-card state-${kind}">
      <div class="state-visual" aria-hidden="true"></div>
      <div>
        <h2>${title}</h2>
        <p>${text}</p>
      </div>
    </article>
  `;
}

function renderAuthState(kind, title, text, actionLabel = '', action = '') {
  return `
    <section class="states-list" aria-label="Auth state">
      <article class="state-card state-${kind}">
        <div class="state-visual" aria-hidden="true"></div>
        <div>
          <h2>${escapeHtml(title)}</h2>
          <p>${escapeHtml(text)}</p>
          ${action ? `<button class="state-action" type="button" data-auth-action="${action}">${actionLabel}</button>` : ''}
        </div>
      </article>
    </section>
  `;
}

function renderUserCard(me) {
  const firstName = escapeHtml(me.telegramUser.firstName);
  const initials = escapeHtml(me.telegramUser.firstName.slice(0, 2).toUpperCase());
  const username = me.telegramUser.username ? `@${escapeHtml(me.telegramUser.username)}` : 'username не задан';
  const activeRole = me.activeRole ? escapeHtml(me.activeRole) : '';

  return `
    <article class="user-card">
      <div class="user-avatar">${initials}</div>
      <div>
        <strong>${firstName}</strong>
        <p>${username}</p>
        <span>${activeRole ? `Активная роль: ${activeRole}` : 'Роль еще не выбрана'}</span>
      </div>
    </article>
  `;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => {
    const entities = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };

    return entities[char];
  });
}
