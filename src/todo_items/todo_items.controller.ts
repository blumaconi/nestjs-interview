import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TodoItemsService } from './todo_items.service';
import { CreateTodoItemDto } from './dtos/create-todo_item';

@Controller('todolists/:listId/items')
export class TodoItemsController {
  constructor(private readonly todoItemsService: TodoItemsService) {}

  @Get()
  findAll(@Param('listId') listId: string) {
    return this.todoItemsService.findAll(Number(listId));
  }

  @Post()
  create(@Param('listId') listId: string, @Body() dto: CreateTodoItemDto) {
    return this.todoItemsService.create(Number(listId), dto);
  }
}
