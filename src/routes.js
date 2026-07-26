export const routes = [
  {
    id: 'orders',
    path: '/',
    label: 'Заказы',
    icon: '01',
    title: 'Заказы',
    access: { auth: true, roles: ['advertiser', 'creator'] },
    render: renderOrders,
  },
  {
    id: 'deals',
    path: '/deals',
    label: 'Сделки',
    creatorLabel: 'Мои сделки',
    icon: '02',
    title: 'Сделки',
    access: { auth: true, roles: ['advertiser', 'creator'] },
    render: renderDeals,
  },
  {
    id: 'profile',
    path: '/profile',
    label: 'Профиль',
    icon: '03',
    title: 'Профиль',
    access: { auth: true, roles: ['advertiser', 'creator'] },
    render: renderProfile,
  },
  {
    id: 'settings',
    path: '/settings',
    label: 'Настройки',
    icon: '04',
    title: 'Настройки',
    access: { auth: true, roles: ['advertiser', 'creator'] },
    render: renderSettings,
  },
  {
    id: 'create',
    path: '/create',
    label: 'Новая задача',
    icon: '+',
    title: 'Новая задача',
    nav: false,
    access: { auth: true, roles: ['advertiser'] },
    render: renderCreate,
  },
  {
    id: 'auth',
    path: '/auth',
    label: 'Вход',
    icon: 'I',
    title: 'Вход',
    nav: false,
    render: renderAuth,
  },
  {
    id: 'role',
    path: '/role',
    label: 'Роль',
    icon: 'R',
    title: 'Выбор роли',
    nav: false,
    access: { auth: true },
    render: renderRoleSelection,
  },
];

export function findRoute(pathname) {
  return routes.find((route) => route.path === pathname) ?? routes[0];
}

export function getRouteLabel(route, activeRole) {
  if (activeRole === 'creator' && route.creatorLabel) return route.creatorLabel;
  return route.label;
}

function renderOrders(context) {
  if (context.auth.me?.activeRole === 'creator') return renderCreatorOrders();
  return renderAdvertiserOrders();
}

function renderAdvertiserOrders() {
  return `
    <section class="work-page">
      <header class="page-head">
        <p class="eyebrow">Заказы</p>
        <h1>Сегодня</h1>
      </header>
      <div class="metric-row">
        ${renderMetric('Активно', '0')}
        ${renderMetric('На проверке', '0')}
        ${renderMetric('Черновики', '0')}
      </div>
      <article class="focus-card">
        <span>Следующее действие</span>
        <strong>Создайте первую задачу</strong>
        <p>Укажите формат, бюджет, сроки и критерии приемки.</p>
        <button class="primary-action" type="button" data-route="/create">Новая задача</button>
      </article>
      ${renderActivityList(['Заявок пока нет', 'Сделки появятся после выбора исполнителя', 'Отчеты будут доступны после приемки результата'])}
    </section>
  `;
}

function renderCreatorOrders() {
  return `
    <section class="work-page">
      <header class="page-head">
        <p class="eyebrow">Заказы</p>
        <h1>Лента задач</h1>
      </header>
      <div class="metric-row">
        ${renderMetric('Подходят', '0')}
        ${renderMetric('Отклики', '0')}
        ${renderMetric('Дедлайны', '0')}
      </div>
      <article class="focus-card">
        <span>Статус</span>
        <strong>Новых задач пока нет</strong>
        <p>Когда появятся подходящие кампании, они будут собраны здесь.</p>
      </article>
      ${renderActivityList(['Профиль готов к заполнению', 'Избранные площадки будут в профиле', 'Выплаты появятся после первой сделки'])}
    </section>
  `;
}

function renderDeals(context) {
  const isCreator = context.auth.me?.activeRole === 'creator';

  return `
    <section class="work-page">
      <header class="page-head">
        <p class="eyebrow">${isCreator ? 'Мои сделки' : 'Сделки'}</p>
        <h1>${isCreator ? 'Выполнение' : 'Контроль'}</h1>
      </header>
      <div class="deal-list">
        ${renderDealRow('Ожидают старта', '0', 'Нет сделок с выбранным исполнителем.')}
        ${renderDealRow('В работе', '0', 'Активные задачи появятся после запуска.')}
        ${renderDealRow('На приемке', '0', 'Результаты для проверки будут здесь.')}
      </div>
    </section>
  `;
}

function renderProfile(context) {
  return `
    <section class="work-page">
      <header class="page-head">
        <p class="eyebrow">Профиль</p>
        <h1>Аккаунт</h1>
      </header>
      ${renderUserCard(context.auth.me)}
      <div class="profile-grid">
        ${renderProfileItem('Роль', getRoleLabel(context.auth.me?.activeRole))}
        ${renderProfileItem('Избранное', '0 сохраненных')}
        ${renderProfileItem('Площадки', 'Не добавлены')}
      </div>
      <div class="profile-actions">
        <button class="primary-action" type="button" data-route="/role">Сменить роль</button>
        <button class="ghost-action" type="button" data-auth-action="logout">Выйти</button>
      </div>
    </section>
  `;
}

function renderSettings() {
  return `
    <section class="work-page">
      <header class="page-head">
        <p class="eyebrow">Настройки</p>
        <h1>Параметры</h1>
      </header>
      <div class="settings-list">
        <article><strong>Уведомления</strong><p>Дедлайны, новые заявки и решения по сделкам.</p></article>
        <article><strong>Безопасность</strong><p>Вход через Telegram включен.</p></article>
        <article><strong>Платежные данные</strong><p>Появятся перед реальными сделками.</p></article>
      </div>
    </section>
  `;
}

function renderCreate() {
  return `
    <section class="work-page">
      <header class="page-head">
        <p class="eyebrow">Новая задача</p>
        <h1>Бриф</h1>
      </header>
      <article class="focus-card">
        <span>Черновик</span>
        <strong>Подготовьте параметры заказа</strong>
        <p>Формат, бюджет, дедлайн и критерии приемки будут собраны в одном брифе.</p>
      </article>
      <div class="deal-list">
        ${renderDealRow('Формат', 'Не выбран', 'Размещение или UGC.')}
        ${renderDealRow('Бюджет', '0 ₽', 'Сумма будет указана в брифе.')}
        ${renderDealRow('Дедлайн', 'Не задан', 'Дата нужна для контроля сделки.')}
      </div>
    </section>
  `;
}

function renderAuth(context) {
  if (context.auth.status === 'checking') {
    return renderAuthState('loading', 'Проверяем вход', 'Это займет пару секунд.');
  }

  if (context.auth.status === 'error') {
    return renderAuthState('error', 'Не получилось войти', context.auth.errorMessage, 'Повторить', 'retry-auth');
  }

  if (context.auth.me) {
    return `
      <section class="work-page">
        <header class="page-head">
          <p class="eyebrow">Аккаунт</p>
          <h1>Вход выполнен</h1>
        </header>
        ${renderUserCard(context.auth.me)}
        <div class="profile-actions">
          <button class="primary-action" type="button" data-route="/role">Выбрать роль</button>
          <button class="ghost-action" type="button" data-auth-action="logout">Выйти</button>
        </div>
      </section>
    `;
  }

  return `
    <section class="work-page auth-intro">
      <header class="page-head">
        <p class="eyebrow">Вход</p>
        <h1>Продолжить</h1>
      </header>
      <button class="primary-action" type="button" data-auth-action="telegram">Войти через Telegram</button>
    </section>
  `;
}

function renderRoleSelection(context) {
  if (!context.auth.me) {
    return renderAuthState('empty', 'Нужно войти', 'Сначала войдите в аккаунт Adnet.', 'Перейти ко входу', 'go-auth');
  }

  return `
    <section class="work-page">
      <header class="page-head">
        <p class="eyebrow">Роль</p>
        <h1>Выберите режим</h1>
      </header>
      ${renderUserCard(context.auth.me)}
      <div class="role-grid">
        ${context.roleOptions
          .map(
            (role) => `
              <button class="role-option ${context.auth.me.activeRole === role.id ? 'active' : ''}" type="button" data-role="${role.id}">
                <span>${role.id === 'advertiser' ? 'AD' : 'CR'}</span>
                <strong>${escapeHtml(role.title)}</strong>
                <p>${escapeHtml(role.description)}</p>
              </button>
            `
          )
          .join('')}
      </div>
    </section>
  `;
}

function renderMetric(label, value) {
  return `<article class="metric-card"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></article>`;
}

function renderActivityList(items) {
  return `
    <div class="activity-list">
      ${items.map((item) => `<article><span></span><p>${escapeHtml(item)}</p></article>`).join('')}
    </div>
  `;
}

function renderDealRow(label, value, note) {
  return `
    <article class="deal-row">
      <div><strong>${escapeHtml(label)}</strong><p>${escapeHtml(note)}</p></div>
      <span>${escapeHtml(value)}</span>
    </article>
  `;
}

function renderProfileItem(label, value) {
  return `<article><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></article>`;
}

function renderAuthState(kind, title, text, actionLabel = '', action = '') {
  return `
    <section class="states-list" aria-label="Состояние входа">
      <article class="state-card state-${kind}">
        <div class="state-visual" aria-hidden="true"></div>
        <div>
          <h2>${escapeHtml(title)}</h2>
          <p>${escapeHtml(text)}</p>
          ${action ? `<button class="state-action" type="button" data-auth-action="${action}">${escapeHtml(actionLabel)}</button>` : ''}
        </div>
      </article>
    </section>
  `;
}

function renderUserCard(me) {
  const firstName = escapeHtml(me.telegramUser.firstName);
  const initials = escapeHtml(me.telegramUser.firstName.slice(0, 2).toUpperCase());
  const username = me.telegramUser.username ? `@${escapeHtml(me.telegramUser.username)}` : 'username не задан';
  const activeRole = me.activeRole ? getRoleLabel(me.activeRole) : '';

  return `
    <article class="user-card">
      <div class="user-avatar">${initials}</div>
      <div>
        <strong>${firstName}</strong>
        <p>${username}</p>
        <span>${activeRole ? `Роль: ${activeRole}` : 'Роль еще не выбрана'}</span>
      </div>
    </article>
  `;
}

function getRoleLabel(role) {
  if (role === 'creator') return 'Исполнитель';
  if (role === 'advertiser') return 'Рекламодатель';
  return 'Не выбрана';
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
