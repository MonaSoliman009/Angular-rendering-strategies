import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { routes } from './app.routes';
import { Csr } from './components/csr/csr';
import { Ssr } from './components/ssr/ssr';
import { Ssg } from './components/ssg/ssg';
import { Todos } from './services/todos';
import { FakeTodos } from '../testing/fake-todos';

describe('app routes', () => {
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideRouter(routes),
        { provide: Todos, useClass: FakeTodos },
      ],
    });
    harness = await RouterTestingHarness.create();
  });

  it('should redirect the empty path to /csr', async () => {
    const component = await harness.navigateByUrl('/');
    expect(TestBed.inject(Router).url).toBe('/csr');
    expect(component).toBeInstanceOf(Csr);
  });

  it('should render Csr at /csr', async () => {
    expect(await harness.navigateByUrl('/csr')).toBeInstanceOf(Csr);
  });

  it('should render Ssr at /ssr', async () => {
    expect(await harness.navigateByUrl('/ssr')).toBeInstanceOf(Ssr);
  });

  it('should render Ssg at /ssg', async () => {
    expect(await harness.navigateByUrl('/ssg')).toBeInstanceOf(Ssg);
  });
});
