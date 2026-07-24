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
    id: 'workspace',
    path: '/workspace',
    label: 'Работа',
    icon: 'W',
    title: 'Workspace layout',
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
      </div>
    </section>
  `;
}

function renderWorkspace() {
  return `
    <section class="screen-grid" aria-label="Каркас рабочих областей">
      <article class="surface-card surface-card-strong">
        <span class="card-index">01</span>
        <h2>Top app frame</h2>
        <p>Постоянная шапка бренда, runtime-статус и контентная зона.</p>
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
        <div><dt>Theme</dt><dd>Dark Adnet tokens with Telegram fallbacks</dd></div>
      </dl>
      <p class="system-note">Здесь нет авторизации или ролей. Этот слой только подготавливает визуальную среду Mini App.</p>
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
