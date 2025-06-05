import { Injectable } from '@nestjs/common';
import { TodoItem } from '../interfaces/todo_item.interface';
import { CreateTodoItemDto } from './dtos/create-todo_item';
import { getNextId } from '../utils/utils';

@Injectable()
export class TodoItemsService {
  private readonly todoItems: TodoItem[] = [];

  findAll(listId: number): TodoItem[] {
    return this.todoItems.filter((item) => item.listId === listId);
  }

  create(listId: number, dto: CreateTodoItemDto): TodoItem {
    const item: TodoItem = {
      id: getNextId(this.todoItems),
      listId,
      description: dto.description,
      completed: dto.completed ?? false,
    };

    this.todoItems.push(item);
    return item;
  }
}
