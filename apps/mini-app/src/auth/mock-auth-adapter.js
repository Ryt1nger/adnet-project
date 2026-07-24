import { isKnownRole, normalizeAuthSession, normalizeMe } from './api-contract.js';

const PREVIEW_TOKEN = 'preview-session-token';

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
        throw new Error('Telegram initData must be passed to the API boundary');
      }

      me = createPreviewUser();
      return normalizeAuthSession({
        sessionToken: PREVIEW_TOKEN,
        me,
      });
    },

    async selectRole(role) {
      if (!me) throw new Error('Session is required before role selection');
      if (!isKnownRole(role)) throw new Error('Unknown role');
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
  return {
    id: 'preview-user',
    telegramUser: {
      id: 'telegram-preview',
      firstName: 'Adnet',
      username: 'preview_user',
    },
    roles: [],
    activeRole: null,
    sessionStatus: 'active',
  };
}
