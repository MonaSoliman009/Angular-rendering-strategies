import { ApplicationRef, provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Todo } from '../models/todo';
import { Todos } from './todos';

const API_URL = 'https://686bfb3914219674dcc6d62a.mockapi.io/todo';

describe('Todos service', () => {
  let fetchSpy: jasmine.Spy<typeof fetch>;

  /** Lets the resource's loader run and settle. */
  async function settle(): Promise<void> {
    TestBed.tick();
    await TestBed.inject(ApplicationRef).whenStable();
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
    fetchSpy = spyOn(window, 'fetch');
  });

  it('should be created', () => {
    fetchSpy.and.resolveTo(new Response('[]'));
    expect(TestBed.inject(Todos)).toBeTruthy();
  });

  it('should return null while the todos are loading', () => {
    fetchSpy.and.returnValue(new Promise<Response>(() => {})); // never resolves
    const service = TestBed.inject(Todos);
    TestBed.tick();

    expect(service.todos()).toBeNull();
  });

  it('should fetch todos from the API and expose them', async () => {
    const todos: Todo[] = [
      { id: '1', name: 'First' },
      { id: '2', name: 'Second' },
    ];
    fetchSpy.and.resolveTo(new Response(JSON.stringify(todos)));
    const service = TestBed.inject(Todos);

    await settle();

    expect(fetchSpy).toHaveBeenCalledOnceWith(API_URL);
    expect(service.todos()).toEqual(todos);
  });

  it('should return an empty list and log when the request fails', async () => {
    const consoleSpy = spyOn(console, 'error');
    fetchSpy.and.rejectWith(new Error('network down'));
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
