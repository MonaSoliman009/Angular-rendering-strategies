import { RenderMode } from '@angular/ssr';

import { serverRoutes } from './app.routes.server';
import { routes } from './app.routes';

describe('server routes', () => {
  const renderModeFor = (path: string) =>
    serverRoutes.find((r) => r.path === path)?.renderMode;

  it('should render /csr on the client', () => {
    expect(renderModeFor('csr')).toBe(RenderMode.Client);
  });

  it('should render /ssr on the server per request', () => {
    expect(renderModeFor('ssr')).toBe(RenderMode.Server);
  });

  it('should prerender /ssg at build time', () => {
    expect(renderModeFor('ssg')).toBe(RenderMode.Prerender);
  });

  it('should prerender any other path by default', () => {
    expect(renderModeFor('**')).toBe(RenderMode.Prerender);
  });

  it('should declare the wildcard route last so it does not shadow others', () => {
    expect(serverRoutes[serverRoutes.length - 1].path).toBe('**');
  });

  it('should define a render mode for every component route', () => {
    const componentPaths = routes
      .filter((r) => r.component)
      .map((r) => r.path);
    for (const path of componentPaths) {
      expect(renderModeFor(path!)).withContext(path!).toBeDefined();
    }
  });
});
