import { Module } from '@nestjs/common';
import { TodoItemsController } from './todo_items.controller';
import { TodoItemsService } from './todo_items.service';

@Module({
  controllers: [TodoItemsController],
  providers: [TodoItemsService],
})
export class TodoItemsModule {}
