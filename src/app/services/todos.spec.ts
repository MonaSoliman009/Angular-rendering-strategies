import { ApplicationRef, provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Todos } from './todos';
import { SAMPLE_TODOS } from '../../testing/fake-todos';

const TODOS_URL = 'https://686bfb3914219674dcc6d62a.mockapi.io/todo';

describe('Todos service', () => {
  let fetchSpy: jasmine.Spy<typeof fetch>;

  /** Lets the resource loader settle (it registers as a pending task). */
  const settle = () => TestBed.inject(ApplicationRef).whenStable();

  beforeEach(() => {
    fetchSpy = spyOn(window, 'fetch');
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('should be provided in root as a singleton', () => {
    fetchSpy.and.resolveTo(new Response('[]'));
    expect(TestBed.inject(Todos)).toBe(TestBed.inject(Todos));
  });

  it('should return null while the todos are loading', () => {
    fetchSpy.and.returnValue(new Promise<Response>(() => {}));
    const service = TestBed.inject(Todos);

    expect(service.todos()).toBeNull();
  });

  it('should fetch the todos from the mock API', async () => {
    fetchSpy.and.resolveTo(new Response(JSON.stringify(SAMPLE_TODOS)));
    const service = TestBed.inject(Todos);
    service.todos();
    await settle();

    expect(fetchSpy).toHaveBeenCalledOnceWith(TODOS_URL);
  });

  it('should expose the fetched todos once loaded', async () => {
    fetchSpy.and.resolveTo(new Response(JSON.stringify(SAMPLE_TODOS)));
    const service = TestBed.inject(Todos);
    await settle();

    expect(service.todos()).toEqual(SAMPLE_TODOS);
  });

  it('should return an empty list and log when the request fails', async () => {
    const consoleSpy = spyOn(console, 'error');
    fetchSpy.and.rejectWith(new TypeError('Network down'));
    const service = TestBed.inject(Todos);
    await settle();

    expect(service.todos()).toEqual([]);
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should return an empty list when the response is not valid JSON', async () => {
    spyOn(console, 'error');
    fetchSpy.and.resolveTo(new Response('not json'));
    const service = TestBed.inject(Todos);
    await settle();

    expect(service.todos()).toEqual([]);
  });
});
