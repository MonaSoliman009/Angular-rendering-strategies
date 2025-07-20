import { ChangeDetectorRef, Component, computed, effect, inject, OnInit } from '@angular/core';
import { Todos } from '../../services/todos';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { Todo } from '../../models/todo';

@Component({
  selector: 'app-csr',
  imports: [CommonModule],
  templateUrl: './csr.html',
  styleUrl: './csr.css',
})
export class Csr {
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
