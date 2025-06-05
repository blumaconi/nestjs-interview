import { Injectable } from '@nestjs/common';
import { CreateTodoListDto } from './dtos/create-todo_list';
import { UpdateTodoListDto } from './dtos/update-todo_list';
import { TodoList } from '../interfaces/todo_list.interface';
import { getNextId } from '../utils/utils';

@Injectable()
export class TodoListsService {
  private readonly todolists: TodoList[];

  constructor(todoLists: TodoList[] = []) {
    this.todolists = todoLists;
  }

  all(): TodoList[] {
    return this.todolists;
  }

  get(id: number): TodoList {
    return this.todolists.find((x) => x.id === Number(id));
  }

  create(dto: CreateTodoListDto): TodoList {
    const todoList: TodoList = {
      id: getNextId(this.todolists),
      name: dto.name,
    };

    this.todolists.push(todoList);

    return todoList;
  }

  update(id: number, dto: UpdateTodoListDto): TodoList {
    const todolist = this.todolists.find((x) => x.id == Number(id));

    // Update the record
    todolist.name = dto.name;

    return todolist;
  }

  delete(id: number): void {
    const index = this.todolists.findIndex((x) => x.id == Number(id));

    if (index > -1) {
      this.todolists.splice(index, 1);
    }
  }
}
