import { TodoList } from '../interfaces/todo_list.interface';
import { TodoItem } from '../interfaces/todo_item.interface';

type MemoryStore = {
  todoLists: TodoList[];
  todoItems: TodoItem[];
};

if (!(global as any).memoryStore) {
  (global as any).memoryStore = {
    todoLists: [],
    todoItems: [],
  } as MemoryStore;
}

export const memoryStore: MemoryStore = (global as any).memoryStore;
