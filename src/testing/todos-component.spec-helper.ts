import { provideZonelessChangeDetection, signal, Type, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Todo } from '../app/models/todo';
import { Todos } from '../app/services/todos';

/**
 * Shared behaviour for the CSR / SSR / SSG components. They all render the
 * same todo list from the `Todos` service; only their render mode differs
 * (configured in `app.routes.server.ts`), so their component-level behaviour
 * should be identical.
 */
export function describeTodosListComponent<T extends { todos: Todo[] }>(
  name: string,
  componentType: Type<T>,
): void {
  describe(name, () => {
    let fixture: ComponentFixture<T>;
    let component: T;
    let todosSignal: WritableSignal<Todo[] | null>;

    const sampleTodos: Todo[] = [
      { id: '1', name: 'Learn CSR' },
      { id: '2', name: 'Learn SSR' },
      { id: '3', name: 'Learn SSG' },
    ];

    const renderedItems = (): string[] =>
      Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('div')).map(
        (el) => el.textContent?.trim() ?? '',
      );

    beforeEach(async () => {
      todosSignal = signal<Todo[] | null>(null);

      await TestBed.configureTestingModule({
        imports: [componentType],
        providers: [
          provideZonelessChangeDetection(),
          { provide: Todos, useValue: { todos: todosSignal } },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(componentType);
      component = fixture.componentInstance;
      await fixture.whenStable();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should start with an empty list while todos are loading', () => {
      expect(component.todos).toEqual([]);
      expect(renderedItems()).toEqual([]);
    });

    it('should render one entry per todo once the service provides data', async () => {
      todosSignal.set(sampleTodos);
      await fixture.whenStable();

      expect(component.todos).toEqual(sampleTodos);
      expect(renderedItems()).toEqual(['Learn CSR', 'Learn SSR', 'Learn SSG']);
    });

    it('should update the list when the service emits new todos', async () => {
      todosSignal.set(sampleTodos);
      await fixture.whenStable();

      todosSignal.set([{ id: '4', name: 'Hydration' }]);
      await fixture.whenStable();

      expect(renderedItems()).toEqual(['Hydration']);
    });

    it('should keep the last loaded todos when the service goes back to loading (null)', async () => {
      todosSignal.set(sampleTodos);
      await fixture.whenStable();

      todosSignal.set(null);
      await fixture.whenStable();

      expect(component.todos).toEqual(sampleTodos);
      expect(renderedItems().length).toBe(3);
    });

    it('should render nothing when the service returns an empty list', async () => {
      todosSignal.set([]);
      await fixture.whenStable();

      expect(renderedItems()).toEqual([]);
    });
  });
}
