import { provideZonelessChangeDetection, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Todos } from '../app/services/todos';
import { Todo } from '../app/models/todo';
import { FakeTodos, SAMPLE_TODOS } from './fake-todos';

interface TodoListComponent {
  todos: Todo[];
}

/**
 * The CSR, SSR and SSG pages share the same behaviour (they only differ in
 * the render mode configured in `app.routes.server.ts`), so they share a
 * common set of specs.
 */
export function describeTodoListComponent(
  name: string,
  component: Type<TodoListComponent>,
): void {
  describe(name, () => {
    let fixture: ComponentFixture<TodoListComponent>;
    let fakeTodos: FakeTodos;

    const renderedNames = (): string[] =>
      Array.from(
        (fixture.nativeElement as HTMLElement).querySelectorAll('div'),
      ).map((el) => el.textContent?.trim() ?? '');

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [component],
        providers: [
          provideZonelessChangeDetection(),
          FakeTodos,
          { provide: Todos, useExisting: FakeTodos },
        ],
      }).compileComponents();

      fakeTodos = TestBed.inject(FakeTodos);
      fixture = TestBed.createComponent(component);
      await fixture.whenStable();
    });

    it('should create', () => {
      expect(fixture.componentInstance).toBeTruthy();
    });

    it('should start with an empty list and render nothing while loading', () => {
      expect(fixture.componentInstance.todos).toEqual([]);
      expect(renderedNames()).toEqual([]);
    });

    it('should render one row per todo once the service emits', async () => {
      fakeTodos.todos.set(SAMPLE_TODOS);
      await fixture.whenStable();

      expect(fixture.componentInstance.todos).toEqual(SAMPLE_TODOS);
      expect(renderedNames()).toEqual(['Learn CSR', 'Learn SSR', 'Learn SSG']);
    });

    it('should update the list when the service emits new todos', async () => {
      fakeTodos.todos.set(SAMPLE_TODOS);
      await fixture.whenStable();

      fakeTodos.todos.set([{ id: '9', name: 'Only one left' }]);
      await fixture.whenStable();

      expect(renderedNames()).toEqual(['Only one left']);
    });

    it('should render an empty list when the service emits []', async () => {
      fakeTodos.todos.set([]);
      await fixture.whenStable();

      expect(fixture.componentInstance.todos).toEqual([]);
      expect(renderedNames()).toEqual([]);
    });

    it('should keep the last todos when the service goes back to loading (null)', async () => {
      fakeTodos.todos.set(SAMPLE_TODOS);
      await fixture.whenStable();

      fakeTodos.todos.set(null);
      await fixture.whenStable();

      expect(fixture.componentInstance.todos).toEqual(SAMPLE_TODOS);
      expect(renderedNames().length).toBe(3);
    });
  });
}
