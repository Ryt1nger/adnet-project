export const routes = [
  {
    id: 'orders',
    path: '/',
    label: 'Кампании',
    creatorLabel: 'Заказы',
    navSlot: 1,
    title: 'Кампании',
    creatorTitle: 'Заказы',
    access: { auth: true, roles: ['advertiser', 'creator'] },
    render: renderOrders,
  },
  {
    id: 'deals',
    path: '/deals',
    label: 'Сделки',
    creatorLabel: 'Мои сделки',
    navSlot: 2,
    title: 'Сделки',
    access: { auth: true, roles: ['advertiser', 'creator'] },
    render: renderDeals,
  },
  {
    id: 'profile',
    path: '/profile',
    label: 'Профиль',
    navSlot: { advertiser: 4, creator: 3 },
    title: 'Профиль',
    access: { auth: true, roles: ['advertiser', 'creator'] },
    render: renderProfile,
  },
  {
    id: 'profile-edit',
    path: '/profile/edit',
    label: 'Редактирование профиля',
    title: 'Редактирование профиля',
    nav: false,
    access: { auth: true, roles: ['advertiser'] },
    render: renderAdvertiserProfileEdit,
  },
  {
    id: 'settings',
    path: '/settings',
    label: 'Настройки',
    navSlot: { advertiser: 5, creator: 4 },
    title: 'Настройки',
    access: { auth: true, roles: ['advertiser', 'creator'] },
    render: renderSettings,
  },
  {
    id: 'settings-account',
    path: '/settings/account',
    label: 'Аккаунт и доступ',
    title: 'Аккаунт и доступ',
    nav: false,
    access: { auth: true, roles: ['advertiser', 'creator'] },
    render: renderSettingsAccount,
  },
  {
    id: 'settings-notifications',
    path: '/settings/notifications',
    label: 'Уведомления',
    title: 'Уведомления',
    nav: false,
    access: { auth: true, roles: ['advertiser', 'creator'] },
    render: renderSettingsNotifications,
  },
  {
    id: 'settings-payments',
    path: '/settings/payments',
    label: 'Платежи и выплаты',
    title: 'Платежи и выплаты',
    nav: false,
    access: { auth: true, roles: ['advertiser', 'creator'] },
    render: renderSettingsPayments,
  },
  {
    id: 'settings-privacy',
    path: '/settings/privacy',
    label: 'Приватность и данные',
    title: 'Приватность и данные',
    nav: false,
    access: { auth: true, roles: ['advertiser', 'creator'] },
    render: renderSettingsPrivacy,
  },
  {
    id: 'settings-general',
    path: '/settings/general',
    label: 'Язык и общие',
    title: 'Язык и общие',
    nav: false,
    access: { auth: true, roles: ['advertiser', 'creator'] },
    render: renderSettingsGeneral,
  },
  {
    id: 'settings-documents',
    path: '/settings/documents',
    label: 'Документы сервиса',
    title: 'Документы сервиса',
    nav: false,
    access: { auth: true, roles: ['advertiser', 'creator'] },
    render: renderSettingsDocuments,
  },
  {
    id: 'settings-actions',
    path: '/settings/actions',
    label: 'Действия аккаунта',
    title: 'Действия аккаунта',
    nav: false,
    access: { auth: true, roles: ['advertiser', 'creator'] },
    render: renderSettingsActions,
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

export function getRouteTitle(route, activeRole) {
  if (activeRole === 'creator' && route.creatorTitle) return route.creatorTitle;
  return route.title;
}

function renderOrders(context) {
  if (context.auth.me?.activeRole === 'creator') return renderCreatorOrders();
  return renderAdvertiserOrders();
}

function renderAdvertiserOrders() {
  return `
    <section class="work-page">
      <div class="metric-row">
        ${renderMetric('Активно', '0')}
        ${renderMetric('На проверке', '0')}
        ${renderMetric('Черновики', '0')}
      </div>
      <article class="focus-card">
        <span>Следующее действие</span>
        <strong>Создайте первую кампанию</strong>
        <p>Укажите формат, бюджет, сроки и критерии приемки.</p>
        <button class="primary-action" type="button" data-route="/create">Новая кампания</button>
      </article>
      ${renderActivityList(['Заявок пока нет', 'Сделки появятся после выбора исполнителя', 'Отчеты будут доступны после приемки результата'])}
    </section>
  `;
}

function renderCreatorOrders() {
  return `
    <section class="work-page">
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
      <div class="deal-list">
        ${renderDealRow('Ожидают старта', '0', 'Нет сделок с выбранным исполнителем.')}
        ${renderDealRow('В работе', '0', 'Активные задачи появятся после запуска.')}
        ${renderDealRow('На приемке', '0', 'Результаты для проверки будут здесь.')}
      </div>
    </section>
  `;
}

function renderProfile(context) {
  if (context.auth.me?.activeRole === 'advertiser') return renderAdvertiserProfile(context);
  return renderCreatorProfile(context);
}

function renderAdvertiserProfile(context) {
  const profile = context.advertiserProfile;
  const isComplete = isAdvertiserProfileComplete(profile);

  return `
    <section class="work-page advertiser-profile-page">
      ${isComplete ? renderAdvertiserProfileCard(profile, 'public') : renderAdvertiserProfileSetup(profile)}
      <div class="profile-actions single-action">
        <button class="primary-action" type="button" data-route="/profile/edit">${isComplete ? 'Редактировать профиль' : 'Заполнить профиль'}</button>
      </div>
      <div class="profile-grid">
        ${renderProfileItem('Статус', getVerificationLabel(profile.verificationStatus))}
        ${renderProfileItem('Категория', profile.category || 'Не выбрана')}
        ${renderProfileItem('Видимость', getVisibilityLabel(profile.visibility))}
      </div>
    </section>
  `;
}

function renderCreatorProfile(context) {
  return `
    <section class="work-page">
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

function renderAdvertiserProfileEdit(context) {
  const profile = context.advertiserProfileDraft ?? context.advertiserProfile;
  const errors = context.profileEditErrors ?? {};

  return `
    <section class="work-page profile-edit-page">
      <button class="settings-back" type="button" data-profile-action="cancel" aria-label="Назад к профилю">
        <span aria-hidden="true">←</span>
        <strong>Редактировать профиль</strong>
      </button>
      ${errors.form ? `<article class="form-error">${escapeHtml(errors.form)}</article>` : ''}
      <form class="profile-edit-form" data-profile-edit-form>
        <article class="profile-avatar-editor">
          ${renderAdvertiserAvatar(profile, 'large')}
          <div>
            <strong>Логотип компании</strong>
            <p>${profile.avatarName ? escapeHtml(profile.avatarName) : 'PNG, JPG или WebP до 1.2 МБ.'}</p>
            <label class="file-picker">
              <input type="file" accept="image/png,image/jpeg,image/webp" data-profile-avatar-input />
              Выбрать изображение
            </label>
            ${renderFieldError(errors.avatar)}
          </div>
        </article>
        ${renderTextField('companyName', 'Название компании', profile.companyName, 'Например: название бренда', 60, errors.companyName)}
        ${renderTextareaField('description', 'Короткое описание', profile.description, 220, errors.description)}
        ${renderTextField('link', 'Сайт или Telegram', profile.link, 'https://site.ru или t.me/channel', 90, errors.link)}
        ${renderCategoryField(profile.category, errors.category)}
        ${renderChoiceField(
          'visibility',
          'Видимость профиля',
          [
            ['hidden', 'Скрыт'],
            ['visible', 'Показывать исполнителям'],
          ],
          profile.visibility
        )}
        ${renderChoiceField(
          'verificationStatus',
          'Статус проверки',
          [
            ['not_submitted', 'Черновик'],
            ['ready', 'Готов к проверке'],
          ],
          profile.verificationStatus
        )}
      </form>
      <div class="profile-actions">
        <button class="ghost-action" type="button" data-profile-action="cancel">Отмена</button>
        <button class="primary-action" type="button" data-profile-action="save" ${isAdvertiserProfileComplete(profile) ? '' : 'disabled'}>Сохранить</button>
      </div>
    </section>
  `;
}

function renderSettings(context) {
  return `
    <section class="work-page settings-page">
      <div class="settings-toolbar">
        <div>
          <span>Управление</span>
          <strong>${escapeHtml(getRoleLabel(context.auth.me?.activeRole))}</strong>
        </div>
        <div class="theme-switch" role="group" aria-label="Тема интерфейса">
          ${renderThemeButton('light', '☀', context.theme)}
          ${renderThemeButton('dark', '☾', context.theme)}
        </div>
      </div>
      <div class="settings-list">
        ${renderSettingsLink('/settings/account', 'Аккаунт и доступ', 'Telegram, роль, входы и активные сессии.', 'Защищено')}
        ${renderSettingsLink('/settings/notifications', 'Уведомления', `${getWorkItemLabel(context.auth.me?.activeRole)}, сделки, платежи и важные события.`, 'Включены')}
        ${renderSettingsLink('/settings/payments', 'Платежи и выплаты', getPaymentsSummary(context), '0 ₽')}
        ${renderSettingsLink('/settings/privacy', 'Приватность и данные', 'Данные Telegram и история действий аккаунта.', '2 раздела')}
        ${renderSettingsLink('/settings/general', 'Язык и общие', getGeneralSummary(context), 'Выбор')}
        ${renderSettingsLink('/settings/documents', 'Документы сервиса', 'Правила, условия, сервисные и пользовательские документы.', 'Библиотека')}
        ${renderSettingsLink('/settings/actions', 'Действия аккаунта', 'Смена роли, выход и управление доступом.', 'Аккаунт')}
      </div>
    </section>
  `;
}

function renderSettingsAccount(context) {
  const me = context.auth.me;
  const username = me?.telegramUser.username ? `@${escapeHtml(me.telegramUser.username)}` : 'username не задан';
  const otherSessions = [];

  return renderSettingsDetail(
    'Аккаунт и доступ',
    `
      <div class="settings-detail-list">
        ${renderSettingsActionRow('telegram-account', 'Telegram-аккаунт', `${escapeHtml(me?.telegramUser.firstName ?? 'Пользователь')} · ${username}`, 'Открыть', context.settingsPanel)}
        ${renderRouteActionRow('/role', 'Роль в Adnet', getRoleLabel(me?.activeRole), 'Изменить')}
        ${renderSettingsActionRow('login-security', 'Безопасность входа', 'Вход выполняется через Telegram.', 'Проверить', context.settingsPanel)}
      </div>
      <article class="session-card compact-session">
        <span>Текущая сессия</span>
        <strong>Это устройство</strong>
        <p>Вход через Telegram активен для текущего рабочего экрана.</p>
      </article>
      ${
        otherSessions.length
          ? `<div class="settings-detail-list">${otherSessions.map((session) => renderSettingsActionRow(session.id, session.title, session.text, 'Открыть', context.settingsPanel)).join('')}</div>`
          : ''
      }
    `
  );
}

function renderSettingsNotifications(context) {
  const notifications = context.settingsPrefs.notifications;
  const workItemLabel = getWorkItemLabel(context.auth.me?.activeRole);

  return renderSettingsDetail(
    'Уведомления',
    `
      <div class="settings-detail-list">
        ${renderSwitchRow('orders', workItemLabel, 'Новые отклики, изменения статуса и дедлайны.', notifications.orders)}
        ${renderSwitchRow('deals', 'Сделки', 'Старт работы, приемка результата и спорные события.', notifications.deals)}
        ${renderSwitchRow('payments', 'Платежи', 'Резервирование бюджета, выплаты и финансовые статусы.', notifications.payments)}
        ${renderSwitchRow('service', 'Служебные', 'Важные изменения аккаунта и безопасности.', notifications.service)}
        ${renderSwitchRow('quiet', 'Тихий режим', 'Уведомления без звука ночью.', notifications.quiet)}
      </div>
    `
  );
}

function renderSettingsPayments(context) {
  const isCreator = context.auth.me?.activeRole === 'creator';
  const rows = isCreator
    ? [
        ['Баланс к выплате', '0 ₽ · появится после принятой сделки', 'Пусто'],
        ['Реквизиты', 'Можно будет добавить перед первой выплатой.', 'Не указаны'],
        ['История выплат', 'Зачисления и удержания будут собраны здесь.', '0 операций'],
        ['Документы', 'Акты и подтверждения выплат.', 'Нет'],
      ]
    : [
        ['Баланс', '0 ₽ · пополнение будет доступно перед запуском кампании', 'Пусто'],
        ['Резервирование', 'Бюджет сделки фиксируется до приемки результата.', 'Готово'],
        ['Способ оплаты', 'Карта или счет появятся перед реальными оплатами.', 'Не указан'],
        ['История платежей', 'Пополнения, резервы и возвраты.', '0 операций'],
      ];

  return renderSettingsDetail(
    'Платежи и выплаты',
    `
      <div class="settings-detail-list">
        ${rows
          .map(([label, text, status]) => renderSettingsActionRow(`payment-${slugify(label)}`, label, text, status, context.settingsPanel))
          .join('')}
      </div>
    `
  );
}

function renderSettingsPrivacy(context) {
  return renderSettingsDetail(
    'Приватность и данные',
    `
      <div class="settings-detail-list">
        ${renderSettingsActionRow('telegram-data', 'Данные Telegram', 'Имя, username и идентификатор для входа.', 'Открыть', context.settingsPanel)}
        ${renderSettingsActionRow('activity-history', 'История действий, изменений и проверок', 'Ключевые события аккаунта и сделок.', 'Открыть', context.settingsPanel)}
      </div>
    `
  );
}

function renderSettingsGeneral(context) {
  return renderSettingsDetail(
    'Язык и общие',
    `
      ${renderChoiceGroup(
        'language',
        'Язык интерфейса',
        [
          ['ru', 'Русский'],
          ['en', 'English'],
        ],
        context.settingsPrefs.language
      )}
      ${renderChoiceGroup(
        'region',
        'Регион',
        [
          ['ru', 'Россия · ₽'],
          ['global', 'Международный'],
        ],
        context.settingsPrefs.region
      )}
    `
  );
}

function renderSettingsDocuments(context) {
  return renderSettingsDetail(
    'Документы сервиса',
    `
      <div class="settings-detail-list">
        ${renderSettingsActionRow('rules-doc', 'Правила платформы', 'Порядок работы заказчиков и исполнителей.', 'Открыть', context.settingsPanel)}
        ${renderSettingsActionRow('terms-doc', 'Условия сервиса', 'Общие условия использования Adnet.', 'Открыть', context.settingsPanel)}
        ${renderSettingsActionRow('data-doc', 'Политика данных', 'Как хранятся и используются данные аккаунта.', 'Открыть', context.settingsPanel)}
        ${renderSettingsActionRow('payment-doc', 'Платежные правила', 'Резервирование, приемка, выплаты и возвраты.', 'Открыть', context.settingsPanel)}
        ${renderSettingsActionRow('user-docs', 'Документы пользователя', 'Файлы и подтверждения, которые могут понадобиться для работы.', 'Открыть', context.settingsPanel)}
      </div>
    `
  );
}

function renderSettingsActions(context) {
  return renderSettingsDetail(
    'Действия аккаунта',
    `
      <div class="settings-detail-list">
        ${renderSettingsActionRow('role-action', 'Текущая роль', getRoleLabel(context.auth.me?.activeRole), 'Изменить', context.settingsPanel)}
        ${renderSettingsActionRow('session-action', 'Сессия', 'Вы вошли через Telegram на этом устройстве.', 'Управлять', context.settingsPanel)}
      </div>
      <div class="settings-actions-grid">
        <button class="primary-action" type="button" data-confirm-action="role">Сменить роль</button>
        <button class="ghost-action danger-action" type="button" data-confirm-action="logout">Выйти</button>
      </div>
      ${renderConfirmation(context.confirmAction)}
    `
  );
}

function renderCreate() {
  return `
    <section class="work-page">
      <article class="focus-card">
        <span>Черновик</span>
        <strong>Подготовьте параметры кампании</strong>
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

function renderAdvertiserProfileSetup(profile) {
  return `
    <article class="advertiser-setup-card">
      ${renderAdvertiserAvatar(profile)}
      <div>
        <span>Профиль компании</span>
        <strong>Заполните данные для исполнителей</strong>
        <p>Добавьте название, описание, ссылку, категорию и настройте видимость.</p>
      </div>
    </article>
  `;
}

function renderAdvertiserProfileCard(profile, mode = 'public') {
  const linkHref = getProfileLinkHref(profile.link);

  return `
    <article class="advertiser-public-card ${mode === 'compact' ? 'compact-preview' : ''}">
      <div class="advertiser-profile-head">
        ${renderAdvertiserAvatar(profile)}
        <div>
          <span>Профиль компании</span>
          <strong>${escapeHtml(profile.companyName)}</strong>
          <em>${escapeHtml(getVerificationLabel(profile.verificationStatus))}</em>
        </div>
      </div>
      <p>${escapeHtml(profile.description)}</p>
      <div class="advertiser-profile-meta">
        <span>${escapeHtml(profile.category)}</span>
        <span>${escapeHtml(getVisibilityLabel(profile.visibility))}</span>
        <a href="${escapeHtml(linkHref)}" target="_blank" rel="noreferrer">${escapeHtml(profile.link)}</a>
      </div>
    </article>
  `;
}

function renderAdvertiserAvatar(profile, size = '') {
  const initials = getInitials(profile.companyName);
  const sizeClass = size === 'large' ? 'large-avatar' : '';

  if (profile.avatarDataUrl) {
    return `
      <div class="advertiser-avatar ${sizeClass}">
        <img src="${escapeHtml(profile.avatarDataUrl)}" alt="${escapeHtml(profile.companyName)}" />
      </div>
    `;
  }

  return `<div class="advertiser-avatar ${sizeClass}" aria-hidden="true">${escapeHtml(initials)}</div>`;
}

function renderTextField(name, label, value, placeholder, maxLength, error = '') {
  return `
    <label class="profile-field">
      <span>${escapeHtml(label)}</span>
      <input name="${escapeHtml(name)}" value="${escapeHtml(value)}" placeholder="${escapeHtml(placeholder)}" maxlength="${maxLength}" />
      <small>${escapeHtml(String(value).length)} / ${maxLength}</small>
      ${renderFieldError(error)}
    </label>
  `;
}

function renderTextareaField(name, label, value, maxLength, error = '') {
  return `
    <label class="profile-field">
      <span>${escapeHtml(label)}</span>
      <textarea name="${escapeHtml(name)}" maxlength="${maxLength}" rows="4">${escapeHtml(value)}</textarea>
      <small>${escapeHtml(String(value).length)} / ${maxLength}</small>
      ${renderFieldError(error)}
    </label>
  `;
}

function renderCategoryField(value, error = '') {
  const categories = ['Медиа и контент', 'E-commerce', 'Образование', 'Финансы', 'Локальный бизнес', 'Технологии'];

  return `
    <article class="profile-field profile-category-field">
      <span>Категория</span>
      <input type="hidden" name="category" value="${escapeHtml(value)}" />
      <div class="profile-category-grid" role="group" aria-label="Выберите категорию">
        ${categories
          .map(
            (category) => `
              <button class="${category === value ? 'active' : ''}" type="button" data-profile-category="${escapeHtml(category)}" aria-pressed="${category === value}">
                ${escapeHtml(category)}
              </button>
            `
          )
          .join('')}
      </div>
      ${renderFieldError(error)}
    </article>
  `;
}

function renderChoiceField(name, label, options, activeValue) {
  return `
    <article class="profile-field">
      <span>${escapeHtml(label)}</span>
      <div class="profile-choice-grid">
        ${options
          .map(
            ([value, text]) => `
              <label>
                <input type="radio" name="${escapeHtml(name)}" value="${escapeHtml(value)}" ${value === activeValue ? 'checked' : ''} />
                ${escapeHtml(text)}
              </label>
            `
          )
          .join('')}
      </div>
    </article>
  `;
}

function renderFieldError(error = '') {
  return error ? `<strong class="field-error">${escapeHtml(error)}</strong>` : '';
}

function getProfileLinkHref(link) {
  if (!link) return '';
  if (link.startsWith('@')) return `https://t.me/${link.slice(1)}`;
  if (/^https?:\/\//.test(link)) return link;
  return '';
}

function getInitials(value) {
  return String(value)
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'AD';
}

function isAdvertiserProfileComplete(profile) {
  return Boolean(profile.companyName && profile.description && profile.link && isProfileLinkValid(profile.link) && profile.category);
}

function isProfileLinkValid(link) {
  return /^(https?:\/\/[^\s.]+\.[^\s]{2,}|https?:\/\/t\.me\/[A-Za-z0-9_]{5,}|@[A-Za-z0-9_]{5,})$/.test(link);
}

function getVisibilityLabel(value) {
  return value === 'visible' ? 'Показывать исполнителям' : 'Скрыт';
}

function getVerificationLabel(value) {
  return value === 'ready' ? 'Готов к проверке' : 'Черновик';
}

function renderThemeButton(theme, label, activeTheme) {
  return `
    <button class="${theme === activeTheme ? 'active' : ''}" type="button" data-theme-choice="${theme}" aria-label="${theme === 'light' ? 'Светлая тема' : 'Темная тема'}" aria-pressed="${theme === activeTheme ? 'true' : 'false'}">
      ${escapeHtml(label)}
    </button>
  `;
}

function renderSettingsLink(path, title, text, status) {
  return `
    <button class="settings-link" type="button" data-route="${path}">
      <span>
        <strong>${escapeHtml(title)}</strong>
        <p>${escapeHtml(text)}</p>
      </span>
      <em>${escapeHtml(status)}</em>
    </button>
  `;
}

function renderSettingsDetail(title, content) {
  return `
    <section class="work-page settings-detail-page">
      <button class="settings-back" type="button" data-route="/settings" aria-label="Назад к настройкам">
        <span aria-hidden="true">←</span>
        <strong>${escapeHtml(title)}</strong>
      </button>
      ${content}
    </section>
  `;
}

function renderSettingsActionRow(panel, label, text, actionLabel, activePanel = '') {
  const isOpen = panel === activePanel;

  return `
    <article class="settings-inline-item">
      <button class="settings-detail-row settings-action-row" type="button" data-settings-panel="${escapeHtml(panel)}" aria-expanded="${isOpen ? 'true' : 'false'}">
        <div>
          <strong>${escapeHtml(label)}</strong>
          <p>${escapeHtml(text)}</p>
        </div>
        <span>${escapeHtml(actionLabel)}</span>
      </button>
      ${isOpen ? renderSettingsPanel(panel) : ''}
    </article>
  `;
}

function renderRouteActionRow(path, label, text, actionLabel) {
  return `
    <button class="settings-detail-row settings-action-row" type="button" data-route="${escapeHtml(path)}">
      <div>
        <strong>${escapeHtml(label)}</strong>
        <p>${escapeHtml(text)}</p>
      </div>
      <span>${escapeHtml(actionLabel)}</span>
    </button>
  `;
}

function renderSwitchRow(key, label, text, checked) {
  return `
    <button class="settings-detail-row switch-row" type="button" data-setting-toggle="${escapeHtml(key)}" role="switch" aria-checked="${checked ? 'true' : 'false'}">
      <div>
        <strong>${escapeHtml(label)}</strong>
        <p>${escapeHtml(text)}</p>
      </div>
      <span class="switch-control ${checked ? 'is-on' : ''}" aria-hidden="true"></span>
    </button>
  `;
}

function renderChoiceGroup(key, title, options, activeValue) {
  return `
    <article class="choice-card">
      <strong>${escapeHtml(title)}</strong>
      <div class="choice-grid" role="group" aria-label="${escapeHtml(title)}">
        ${options
          .map(
            ([value, label]) => `
              <button class="${value === activeValue ? 'active' : ''}" type="button" data-setting-choice="${escapeHtml(key)}" data-setting-value="${escapeHtml(value)}" aria-pressed="${value === activeValue ? 'true' : 'false'}">
                ${escapeHtml(label)}
              </button>
            `
          )
          .join('')}
      </div>
    </article>
  `;
}

function renderSettingsPanel(panel) {
  const panels = {
    'telegram-account': ['Telegram-аккаунт', 'Adnet использует Telegram для входа и связи аккаунта с рабочими действиями. Имя и username показываются только там, где это нужно для сделки или безопасности.'],
    'login-security': ['Безопасность входа', 'Вход подтверждается через Telegram. Позже здесь появятся дополнительные проверки, список устройств и журнал доступа.'],
    'payment-balans': ['Баланс', 'Финансовая модель еще уточняется. Сейчас экран показывает будущую точку управления балансом без реальных операций.'],
    'payment-balans-k-vyplate': ['Баланс к выплате', 'Начисления появятся после первой принятой сделки. До подключения выплат сумма остается нулевой.'],
    'payment-rezervirovanie': ['Резервирование', 'Бюджет сделки планируется фиксировать до приемки результата, чтобы обе стороны видели прозрачный статус.'],
    'payment-rekvizity': ['Реквизиты', 'Реквизиты можно будет добавить перед первой выплатой, когда будет выбран финансовый сценарий.'],
    'payment-sposob-oplaty': ['Способ оплаты', 'Способы оплаты будут подключаться после утверждения платежной модели Adnet.'],
    'payment-istoriya-vyplat': ['История выплат', 'Здесь будут собраны выплаты, удержания и связанные документы.'],
    'payment-istoriya-platezhey': ['История платежей', 'Здесь будут собраны пополнения, резервы, списания и возвраты.'],
    'payment-dokumenty': ['Документы', 'Акты и подтверждения выплат появятся после подключения финансового контура.'],
    'telegram-data': ['Данные Telegram', 'Используются имя, username и Telegram ID для входа, отображения участникам сделки и восстановления доступа.'],
    'activity-history': ['История действий, изменений и проверок', 'Здесь будет журнал важных изменений: входы, смена роли, обновление платежных данных, запуск и приемка сделок.'],
    'rules-doc': ['Правила платформы', 'Раздел для правил взаимодействия, модерации, приемки результата и поведения участников.'],
    'terms-doc': ['Условия сервиса', 'Будущий раздел с условиями использования Adnet и рамками ответственности сервиса.'],
    'data-doc': ['Политика данных', 'Будущий раздел о составе данных, хранении, доступе и пользовательских запросах.'],
    'payment-doc': ['Платежные правила', 'Будущий раздел о резервировании, приемке, выплатах, возвратах и спорных ситуациях.'],
    'user-docs': ['Документы пользователя', 'Здесь могут появляться документы, подтверждения или файлы, нужные конкретному пользователю.'],
    'role-action': ['Текущая роль', 'Смена роли влияет на навигацию и рабочие сценарии. Подтверждение доступно кнопкой ниже.'],
    'session-action': ['Сессия', 'Текущая сессия активна через Telegram. Выход завершит доступ на этом устройстве.'],
  };

  if (!panel || !panels[panel]) return '';
  const [title, text] = panels[panel];

  return `
    <article class="settings-info-panel">
      <button type="button" data-settings-panel-close aria-label="Закрыть">×</button>
      <strong>${escapeHtml(title)}</strong>
      <p>${escapeHtml(text)}</p>
    </article>
  `;
}

function renderConfirmation(action) {
  const confirmations = {
    role: ['Сменить роль?', 'После выбора роли изменятся рабочие разделы и нижняя навигация.', 'Перейти'],
    logout: ['Выйти из аккаунта?', 'Текущая сессия завершится, для возврата понадобится вход через Telegram.', 'Выйти'],
  };

  if (!action || !confirmations[action]) return '';
  const [title, text, actionLabel] = confirmations[action];

  return `
    <article class="confirmation-panel">
      <strong>${escapeHtml(title)}</strong>
      <p>${escapeHtml(text)}</p>
      <div>
        <button class="ghost-action" type="button" data-confirm-cancel>Отмена</button>
        <button class="primary-action" type="button" data-confirm-accept="${escapeHtml(action)}">${escapeHtml(actionLabel)}</button>
      </div>
    </article>
  `;
}

function getPaymentsSummary(context) {
  if (context.auth.me?.activeRole === 'creator') return 'Баланс к выплате, реквизиты и история начислений.';
  return 'Баланс, резервирование бюджета и способы оплаты.';
}

function getWorkItemLabel(role) {
  return role === 'creator' ? 'Заказы' : 'Кампании';
}

function getGeneralSummary(context) {
  const language = context.settingsPrefs.language === 'en' ? 'English' : 'Русский';
  const region = context.settingsPrefs.region === 'global' ? 'международный' : 'Россия';
  return `${language}, ${region}`;
}

function slugify(value) {
  const map = {
    'Баланс': 'balans',
    'Баланс к выплате': 'balans-k-vyplate',
    'Реквизиты': 'rekvizity',
    'Резервирование': 'rezervirovanie',
    'Способ оплаты': 'sposob-oplaty',
    'История выплат': 'istoriya-vyplat',
    'История платежей': 'istoriya-platezhey',
    'Документы': 'dokumenty',
  };

  return map[value] ?? String(value).toLowerCase().replace(/\s+/g, '-');
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
