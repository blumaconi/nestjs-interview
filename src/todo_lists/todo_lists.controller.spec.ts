import { Test, TestingModule } from '@nestjs/testing';
import { TodoListsController } from './todo_lists.controller';
import { TodoListsService } from './todo_lists.service';
import { memoryStore } from '../shared/memory.store';

describe('TodoListsController', () => {
  let todoListsController: TodoListsController;

  beforeEach(async () => {
    memoryStore.todoLists.length = 0;
    memoryStore.todoLists.push(
      { id: 1, name: 'test1' },
      { id: 2, name: 'test2' },
    );

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoListsController],
      providers: [TodoListsService],
    }).compile();

    todoListsController = module.get<TodoListsController>(TodoListsController);
  });

  describe('index', () => {
    it('should return the list of todolists', () => {
      expect(todoListsController.index()).toEqual([
        { id: 1, name: 'test1' },
        { id: 2, name: 'test2' },
      ]);
    });
  });

  describe('show', () => {
    it('should return the todolist with the given id', () => {
      expect(todoListsController.show({ todoListId: 1 })).toEqual({
        id: 1,
        name: 'test1',
      });
    });
  });

  describe('update', () => {
    it('should update the todolist with the given id', () => {
      expect(
        todoListsController.update({ todoListId: 1 }, { name: 'modified' }),
      ).toEqual({ id: 1, name: 'modified' });

      expect(memoryStore.todoLists.find((x) => x.id === 1)?.name).toEqual(
        'modified',
      );
    });
  });

  describe('create', () => {
    it('should create a new todolist', () => {
      const created = todoListsController.create({ name: 'new' });

      expect(created).toEqual({ id: 3, name: 'new' });
      expect(memoryStore.todoLists.length).toBe(3);
    });
  });

  describe('delete', () => {
    it('should delete the todolist with the given id', () => {
      expect(() => todoListsController.delete({ todoListId: 1 })).not.toThrow();

      expect(memoryStore.todoLists.map((x) => x.id)).toEqual([2]);
    });
  });
});
