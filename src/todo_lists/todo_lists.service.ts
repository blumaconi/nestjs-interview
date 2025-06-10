import { Injectable } from '@nestjs/common';
import { CreateTodoListDto } from './dtos/create-todo_list';
import { UpdateTodoListDto } from './dtos/update-todo_list';
import { TodoList } from '../interfaces/todo_list.interface';
import { getNextId } from '../utils/utils';
import { memoryStore } from '../shared/memory.store';

@Injectable()
export class TodoListsService {
  all(): TodoList[] {
    return memoryStore.todoLists;
  }

  get(id: number): TodoList {
    return memoryStore.todoLists.find((x) => x.id === Number(id));
  }

  create(dto: CreateTodoListDto): TodoList {
    const todoList: TodoList = {
      id: getNextId(memoryStore.todoLists),
      name: dto.name,
    };

    memoryStore.todoLists.push(todoList);

    return todoList;
  }

  update(id: number, dto: UpdateTodoListDto): TodoList {
    const todolist = memoryStore.todoLists.find((x) => x.id == Number(id));

    // Update the record
    todolist.name = dto.name;

    return todolist;
  }

  delete(id: number): void {
    const index = memoryStore.todoLists.findIndex((x) => x.id == Number(id));

    if (index > -1) {
      memoryStore.todoLists.splice(index, 1);
    }
  }

  findByName(name: string) {
    return memoryStore.todoLists.find(
      (list) => list.name.toLowerCase() === name.toLowerCase(),
    );
  }
}
