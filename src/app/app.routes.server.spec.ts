import { RenderMode } from '@angular/ssr';

import { routes } from './app.routes';
import { serverRoutes } from './app.routes.server';

describe('serverRoutes', () => {
  const modeFor = (path: string) => serverRoutes.find((r) => r.path === path)?.renderMode;

  it('should render /csr on the client', () => {
    expect(modeFor('csr')).toBe(RenderMode.Client);
  });

  it('should render /ssr on the server per request', () => {
    expect(modeFor('ssr')).toBe(RenderMode.Server);
  });

  it('should prerender /ssg at build time', () => {
    expect(modeFor('ssg')).toBe(RenderMode.Prerender);
  });

  it('should prerender any other route by default', () => {
    expect(modeFor('**')).toBe(RenderMode.Prerender);
  });

  it('should define a render mode for every client route with a component', () => {
    const clientPaths = routes.filter((r) => r.component).map((r) => r.path);
    const serverPaths = serverRoutes.map((r) => r.path);

    for (const path of clientPaths) {
      expect(serverPaths).withContext(`missing server route for "${path}"`).toContain(path!);
    }
  });
});
