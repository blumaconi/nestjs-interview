import { Injectable } from '@nestjs/common';
import { TodoItem } from '../interfaces/todo_item.interface';
import { CreateTodoItemDto } from './dtos/create-todo_item';
import { getNextId } from '../utils/utils';
import { UpdateTodoItemDto } from './dtos/update-todo_item';
import { memoryStore } from '../shared/memory.store';

@Injectable()
export class TodoItemsService {
  findAll(listId: number): TodoItem[] {
    return memoryStore.todoItems.filter((item) => item.listId === listId);
  }

  create(listId: number, dto: CreateTodoItemDto): TodoItem {
    const duplicate = memoryStore.todoItems
      .filter((item) => item.listId === listId)
      .find((item) => item.description === dto.description);

    if (duplicate) {
      throw new Error(
        `A task with the description "${dto.description}" already exists in list`,
      );
    }

    const item: TodoItem = {
      id: getNextId(memoryStore.todoItems),
      listId,
      description: dto.description,
      completed: dto.completed ?? false,
    };

    memoryStore.todoItems.push(item);
    return item;
  }

  update(listId: number, itemId: number, dto: UpdateTodoItemDto): TodoItem {
    const item = memoryStore.todoItems.find(
      (i) => i.listId === listId && i.id === itemId,
    );

    if (!item) {
      throw new Error('Item not found');
    }

    if (dto.completed !== undefined) {
      throw new Error('You cannot update completion status from this endpoint');
    }

    if (dto.description !== undefined) {
      item.description = dto.description;
    }

    return item;
  }

  setCompleted(id: number) {
    const item = this.findById(id);

    if (!item) {
      throw new Error('Item not found');
    }

    item.completed = true;
    return item;
  }

  delete(listId: number, itemId: number): void {
    const index = memoryStore.todoItems.findIndex(
      (item) => item.id === itemId && item.listId === listId,
    );

    if (index === -1) {
      throw new Error('Item not found');
    }

    memoryStore.todoItems.splice(index, 1);
  }

  findById(id: number) {
    return memoryStore.todoItems.find((item) => item.id === Number(id));
  }
}
