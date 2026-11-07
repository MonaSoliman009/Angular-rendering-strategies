import { Component, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { Navbar } from './navbar';

@Component({ template: '' })
class Dummy {}

describe('Navbar', () => {
  let component: Navbar;
  let fixture: ComponentFixture<Navbar>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Navbar],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([
          { path: 'csr', component: Dummy },
          { path: 'ssr', component: Dummy },
          { path: 'ssg', component: Dummy },
        ]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Navbar);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a link for every rendering strategy', () => {
    const links = Array.from(element.querySelectorAll<HTMLAnchorElement>('a.nav-link'));

    expect(links.map((a) => a.textContent?.trim())).toEqual(['CSR', 'SSR', 'SSG']);
    expect(links.map((a) => a.getAttribute('href'))).toEqual(['/csr', '/ssr', '/ssg']);
  });

  for (const path of ['csr', 'ssr', 'ssg']) {
    it(`should navigate to /${path} when its link is clicked`, async () => {
      const router = TestBed.inject(Router);
      const link = element.querySelector<HTMLAnchorElement>(`a[href="/${path}"]`)!;

      link.click();
      await fixture.whenStable();

      expect(router.url).toBe(`/${path}`);
    });
  }
});
