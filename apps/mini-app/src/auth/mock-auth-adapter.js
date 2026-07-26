import { isKnownRole, normalizeAuthSession, normalizeMe } from './api-contract.js';

const PREVIEW_TOKEN = 'adnet-session-token';
const PREVIEW_ROLE_KEY = 'adnet.miniApp.previewRole';

export function createMockAuthAdapter() {
  let me = null;

  return {
    async restoreSession(sessionToken) {
      if (!sessionToken) return null;
      me = me ?? createPreviewUser();
      return normalizeMe(me);
    },

    async authenticateWithTelegram({ initData }) {
      if (typeof initData !== 'string') {
        throw new Error('Не удалось получить данные для входа');
      }

      me = createPreviewUser();
      return normalizeAuthSession({
        sessionToken: PREVIEW_TOKEN,
        me,
      });
    },

    async selectRole(role) {
      if (!me) throw new Error('Session is required before role selection');
      if (!isKnownRole(role)) throw new Error('Выберите доступную роль');
      writePreviewRole(role);
      me = {
        ...me,
        roles: Array.from(new Set([...me.roles, role])),
        activeRole: role,
      };
      return normalizeMe(me);
    },

    async logout() {
      me = null;
    },
  };
}

function createPreviewUser() {
  const activeRole = readPreviewRole();

  return {
    id: 'adnet-user',
    telegramUser: {
      id: 'telegram-user',
      firstName: 'Adnet',
      username: 'adnet_user',
    },
    roles: [activeRole],
    activeRole,
    sessionStatus: 'active',
  };
}

function readPreviewRole() {
  try {
    const savedRole = window.localStorage?.getItem(PREVIEW_ROLE_KEY);
    return isKnownRole(savedRole) ? savedRole : 'advertiser';
  } catch {
    return 'advertiser';
  }
}

function writePreviewRole(role) {
  try {
    window.localStorage?.setItem(PREVIEW_ROLE_KEY, role);
  } catch {
    // Preview role persistence is optional; role selection still works in memory.
  }
}
