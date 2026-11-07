import { provideZonelessChangeDetection, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { App } from './app';
import { routes } from './app.routes';
import { Csr } from './components/csr/csr';
import { Ssg } from './components/ssg/ssg';
import { Ssr } from './components/ssr/ssr';
import { Todos } from './services/todos';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter(routes),
        // Avoid real HTTP calls from the routed components.
        { provide: Todos, useValue: { todos: signal([]) } },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the navbar and a router outlet', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('app-navbar')).not.toBeNull();
    expect(compiled.querySelector('router-outlet')).not.toBeNull();
  });

  describe('routing', () => {
    let harness: RouterTestingHarness;

    beforeEach(async () => {
      harness = await RouterTestingHarness.create();
    });

    it('should redirect the empty path to /csr', async () => {
      const component = await harness.navigateByUrl('/');
      expect(component).toBeInstanceOf(Csr);
      expect(harness.routeNativeElement).not.toBeNull();
    });

    it('should route /csr to the Csr component', async () => {
      expect(await harness.navigateByUrl('/csr')).toBeInstanceOf(Csr);
    });

    it('should route /ssr to the Ssr component', async () => {
      expect(await harness.navigateByUrl('/ssr')).toBeInstanceOf(Ssr);
    });

    it('should route /ssg to the Ssg component', async () => {
      expect(await harness.navigateByUrl('/ssg')).toBeInstanceOf(Ssg);
    });
  });
});
