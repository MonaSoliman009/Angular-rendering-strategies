import { Injectable, signal } from '@angular/core';
import { Todo } from '../app/models/todo';

/**
 * Test double for the `Todos` service.
 * Exposes a writable `todos` signal so specs can simulate the
 * loading (null), empty ([]) and loaded states without hitting the network.
 */
@Injectable()
export class FakeTodos {
  readonly todos = signal<Todo[] | null>(null);
}

export const SAMPLE_TODOS: Todo[] = [
  { id: '1', name: 'Learn CSR' },
  { id: '2', name: 'Learn SSR' },
  { id: '3', name: 'Learn SSG' },
];
