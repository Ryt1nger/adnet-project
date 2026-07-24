export const AUTH_ENDPOINTS = {
  telegram: '/auth/telegram',
  me: '/me',
  role: '/me/role',
  logout: '/auth/logout',
};

export const ROLE_OPTIONS = [
  {
    id: 'advertiser',
    title: 'Рекламодатель',
    description: 'Создает кампании, выбирает исполнителей и принимает результат.',
  },
  {
    id: 'creator',
    title: 'Исполнитель',
    description: 'Откликается на кампании, сдает Evidence и отслеживает выплату.',
  },
];

export function isKnownRole(role) {
  return ROLE_OPTIONS.some((option) => option.id === role);
}

export function normalizeMe(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Invalid /me response');
  }

  const roles = Array.isArray(payload.roles) ? payload.roles.filter(isKnownRole) : [];
  const activeRole = isKnownRole(payload.activeRole) ? payload.activeRole : null;

  return {
    id: String(payload.id ?? ''),
    telegramUser: normalizeTelegramUser(payload.telegramUser),
    roles,
    activeRole,
    sessionStatus: payload.sessionStatus === 'active' ? 'active' : 'pending',
  };
}

export function normalizeAuthSession(payload) {
  if (!payload || typeof payload !== 'object' || typeof payload.sessionToken !== 'string') {
    throw new Error('Invalid auth session response');
  }

  return {
    sessionToken: payload.sessionToken,
    me: normalizeMe(payload.me),
  };
}

function normalizeTelegramUser(user) {
  if (!user || typeof user !== 'object') {
    return {
      id: '',
      firstName: 'Adnet user',
      username: '',
    };
  }

  return {
    id: String(user.id ?? ''),
    firstName: String(user.firstName ?? 'Adnet user'),
    username: String(user.username ?? ''),
  };
}
