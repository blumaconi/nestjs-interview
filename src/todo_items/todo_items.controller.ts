import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TodoItemsService } from './todo_items.service';
import { CreateTodoItemDto } from './dtos/create-todo_item';
import { UpdateTodoItemDto } from './dtos/update-todo_item';

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

  @Put(':itemId')
  update(
    @Param('listId') listId: string,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateTodoItemDto,
  ) {
    return this.todoItemsService.update(Number(listId), Number(itemId), dto);
  }

  @Delete(':itemId')
  delete(@Param('listId') listId: string, @Param('itemId') itemId: string) {
    return this.todoItemsService.delete(Number(listId), Number(itemId));
  }
}
