export function setupGitHubPagesRouting() {
  const redirect = sessionStorage.getItem('redirect');
  if (redirect) {
    sessionStorage.removeItem('redirect');
    window.history.replaceState(null, '', redirect);
  }
}

export function getBasePath(): string {
  if (typeof window === 'undefined') return '/';
  
  const pathSegments = window.location.pathname.split('/').filter(Boolean);
  if (pathSegments.length > 0 && !pathSegments[0].includes('.')) {
    return `/${pathSegments[0]}`;
  }
  
  return '/';
}
