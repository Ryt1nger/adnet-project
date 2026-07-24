export function createAuthClient({ adapter, store }) {
  return {
    async restoreSession() {
      const token = store.read();
      if (!token) {
        return {
          status: 'anonymous',
          me: null,
        };
      }

      const me = await adapter.restoreSession(token);
      if (!me) {
        store.clear();
        return {
          status: 'anonymous',
          me: null,
        };
      }

      return {
        status: me.activeRole ? 'ready' : 'role_required',
        me,
      };
    },

    async authenticateWithTelegram(initData) {
      const session = await adapter.authenticateWithTelegram({ initData });
      store.write(session.sessionToken);
      return {
        status: session.me.activeRole ? 'ready' : 'role_required',
        me: session.me,
      };
    },

    async selectRole(role) {
      const me = await adapter.selectRole(role);
      return {
        status: 'ready',
        me,
      };
    },

    async logout() {
      await adapter.logout();
      store.clear();
      return {
        status: 'anonymous',
        me: null,
      };
    },
  };
}
