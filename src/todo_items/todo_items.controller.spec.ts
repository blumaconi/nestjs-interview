import { Test, TestingModule } from '@nestjs/testing';
import { TodoItemsController } from './todo_items.controller';
import { TodoItemsService } from './todo_items.service';
import { CreateTodoItemDto } from './dtos/create-todo_item';

describe('TodoItemController', () => {
  let todoItemsService: TodoItemsService;
  let todoItemsController: TodoItemsController;

  beforeEach(async () => {
    todoItemsService = new TodoItemsService();

    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [TodoItemsController],
      providers: [{ provide: TodoItemsService, useValue: todoItemsService }],
    }).compile();

    todoItemsController =
      moduleRef.get<TodoItemsController>(TodoItemsController);
  });
  // Tests for the TodoItemsController
  describe('findall', () => {
    it('should return all items for the given listId', () => {
      todoItemsService.create(1, { description: 'Task 1' });
      todoItemsService.create(1, { description: 'Task 2' });
      todoItemsService.create(2, { description: 'Task from another list' });

      const result = todoItemsController.findAll('1');

      // Verify that the result contains only the elements from list 1
      expect(result).toEqual([
        { id: 1, listId: 1, description: 'Task 1', completed: false },
        { id: 2, listId: 1, description: 'Task 2', completed: false },
      ]);
    });
  });

  describe('create', () => {
    it('should create a new todo item in the given list', () => {
      const dto: CreateTodoItemDto = {
        description: 'New task',
      };

      const result = todoItemsController.create('1', dto);

      expect(result).toEqual({
        id: 1,
        listId: 1,
        description: 'New task',
        completed: false,
      });

      // Verifies that the array of todoItems contains one element
      expect(todoItemsService['todoItems'].length).toBe(1);
    });
  });

  describe('update', () => {
    it('should update the description of the item', () => {
      todoItemsService.create(1, { description: 'Existing task' });

      const result = todoItemsController.update('1', '1', {
        description: 'Updated task',
      });

      expect(result).toEqual({
        id: 1,
        listId: 1,
        description: 'Updated task',
        completed: false,
      });
    });

    it('should throw an error if trying to update completed status', () => {
      todoItemsService.create(1, { description: 'Another task' });

      expect(() =>
        todoItemsController.update('1', '1', {
          description: 'Still valid',
          completed: true,
        }),
      ).toThrowError('You cannot update completion status from this endpoint');
    });
  });

  describe('complete', () => {
    it('should mark the task as completed', () => {
      todoItemsService.create(1, { description: 'Sample task' });

      const result = todoItemsController.complete(1);

      expect(result).toEqual({
        id: 1,
        listId: 1,
        description: 'Sample task',
        completed: true,
      });
    });

    it('should throw an error if the item does not exist', () => {
      expect(() => todoItemsController.complete(999)).toThrowError(
        'Item not found',
      );
    });
  });

  describe('delete', () => {
    it('should delete the todo item with the given id and listId', () => {
      (todoItemsService as any).todoItems = [
        {
          id: 1,
          listId: 1,
          description: 'Sample task',
          completed: false,
        },
      ];

      // execute the delete method
      todoItemsService.delete(1, 1);

      // verify the array is now empty
      expect((todoItemsService as any).todoItems).toHaveLength(0);
    });

    it('should throw an error if the item is not found', () => {
      expect(() => todoItemsService.delete(1, 999)).toThrow('Item not found');
    });
  });
});
