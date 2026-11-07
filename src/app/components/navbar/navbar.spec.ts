import { Component, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { Navbar } from './navbar';

@Component({ template: '' })
class DummyPage {}

describe('Navbar', () => {
  let fixture: ComponentFixture<Navbar>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Navbar],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([
          { path: 'csr', component: DummyPage },
          { path: 'ssr', component: DummyPage },
          { path: 'ssg', component: DummyPage },
        ]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Navbar);
    element = fixture.nativeElement;
    await fixture.whenStable();
  });

  const navLinks = () =>
    Array.from(element.querySelectorAll<HTMLAnchorElement>('a.nav-link'));

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render a link for each rendering strategy', () => {
    expect(navLinks().map((a) => a.textContent?.trim())).toEqual([
      'CSR',
      'SSR',
      'SSG',
    ]);
  });

  it('should point each link to its route', () => {
    expect(navLinks().map((a) => a.getAttribute('href'))).toEqual([
      '/csr',
      '/ssr',
      '/ssg',
    ]);
  });

  for (const path of ['csr', 'ssr', 'ssg']) {
    it(`should navigate to /${path} when its link is clicked`, async () => {
      const router = TestBed.inject(Router);
      const link = navLinks().find((a) => a.getAttribute('href') === `/${path}`)!;

      link.click();
      await fixture.whenStable();

      expect(router.url).toBe(`/${path}`);
    });
  }
});
