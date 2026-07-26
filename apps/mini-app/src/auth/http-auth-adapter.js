import { AUTH_ENDPOINTS, normalizeAuthSession, normalizeMe } from './api-contract.js';

export function createHttpAuthAdapter({ baseUrl = '', fetchImpl = window.fetch } = {}) {
  let sessionToken = null;

  return {
    async restoreSession(token) {
      sessionToken = token;
      if (!sessionToken) return null;
      return normalizeMe(await request(AUTH_ENDPOINTS.me, { method: 'GET' }));
    },

    async authenticateWithTelegram({ initData }) {
      const session = normalizeAuthSession(
        await request(AUTH_ENDPOINTS.telegram, {
          method: 'POST',
          body: { initData },
          anonymous: true,
        })
      );
      sessionToken = session.sessionToken;
      return session;
    },

    async selectRole(role) {
      return normalizeMe(
        await request(AUTH_ENDPOINTS.role, {
          method: 'POST',
          body: { role },
        })
      );
    },

    async logout() {
      await request(AUTH_ENDPOINTS.logout, { method: 'POST' });
      sessionToken = null;
    },
  };

  async function request(path, options = {}) {
    const response = await fetchImpl(`${baseUrl}${path}`, {
      method: options.method,
      headers: buildHeaders(options.anonymous),
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      throw new Error('Не удалось подтвердить вход');
    }

    if (response.status === 204) return null;
    return response.json();
  }

  function buildHeaders(anonymous) {
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    if (!anonymous && sessionToken) {
      headers.Authorization = `Bearer ${sessionToken}`;
    }

    return headers;
  }
}
