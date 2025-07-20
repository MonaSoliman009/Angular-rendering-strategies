import { computed, Injectable, resource, signal } from '@angular/core';
import { Todo } from '../models/todo';

@Injectable({
  providedIn: 'root',
})
export class Todos {
  todosResource = signal(
    resource({
      loader: async () => {
        let res = await fetch(
          'https://686bfb3914219674dcc6d62a.mockapi.io/todo'
        );
        let data = await res.json();

        return data;
      },
    })
  );

  todos = computed(() => {
    const resource = this.todosResource();

    if (resource.isLoading()) {
      return null; // or show a loading spinner in the component
    }

    if (resource.error()) {
      console.error(resource.error);
      return [];
    }

    return resource.value();
  });
}
