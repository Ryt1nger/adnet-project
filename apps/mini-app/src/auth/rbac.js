export function canAccessRoute(route, authState) {
  const access = route.access ?? { auth: false };
  if (!access.auth) return true;
  if (authState.status === 'checking') return true;
  if (!authState.me) return false;
  if (!access.roles || access.roles.length === 0) return true;
  return access.roles.includes(authState.me.activeRole);
}

export function getAccessRedirect(route, authState) {
  const access = route.access ?? { auth: false };
  if (!access.auth) return null;
  if (authState.status === 'checking') return null;
  if (!authState.me) return '/auth';
  if (!authState.me.activeRole) return '/role';
  if (!canAccessRoute(route, authState)) return '/auth';
  return null;
}
