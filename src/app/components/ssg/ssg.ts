import { ChangeDetectorRef, Component, effect, inject } from '@angular/core';
import { Todos } from '../../services/todos';
import { Todo } from '../../models/todo';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-ssg',
  imports: [NgForOf],
  templateUrl: './ssg.html',
  styleUrl: './ssg.css'
})
export class Ssg {
  todosService = inject(Todos);
    cdr = inject(ChangeDetectorRef);

  todos:Todo[]=[]
  constructor() {
    effect(() => {
      const value = this.todosService.todos();
      if (value) {
        this.todos = value;        // Update your local variable
        this.cdr.markForCheck();   // Or detectChanges() if you're using OnPush
      }
    });
  }
}
