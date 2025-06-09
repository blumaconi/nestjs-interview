import { TodoItemsService } from './todo_items.service';
import { TodoItem } from '../interfaces/todo_item.interface';

describe('TodoItemsService', () => {
  let service: TodoItemsService;

  beforeEach(() => {
    service = new TodoItemsService();
  });

  describe('findAll', () => {
    it('should return an empty array when the list has no items', () => {
      const result = service.findAll(1);
      expect(result).toEqual([]);
    });

    it('should return all items for the given listId', () => {
      service.create(1, { description: 'Task 1' });
      service.create(1, { description: 'Task 2' });

      service.create(2, { description: 'Task from another list' });

      const result = service.findAll(1);

      expect(result).toEqual([
        { id: 1, listId: 1, description: 'Task 1', completed: false },
        { id: 2, listId: 1, description: 'Task 2', completed: false },
      ]);
    });
  });

  describe('create', () => {
    it('should create a new todo item in the given list', () => {
      const listId = 1;
      const description = 'Test task';

      const result: TodoItem = service.create(listId, { description });

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.description).toBe(description);
      expect(result.listId).toBe(listId);
      expect(result.completed).toBe(false);
    });

    it('should throw an error if the description already exists in the same list', () => {
      const listId = 1;
      const description = 'Duplicated task';

      // Create the first valid item
      service.create(listId, { description });

      // Attempt to create another item with the same description in the same list (should throw an error)
      expect(() => {
        service.create(listId, { description });
      }).toThrowError(
        `A task with the description "${description}" already exists in list`,
      );
    });
  });

  describe('update', () => {
    beforeEach(() => {
      service.create(1, { description: 'Existing task' });
    });

    it('should update the description of an existing item', () => {
      const dto = { description: 'Updated task' };

      const result = service.update(1, 1, dto);

      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(result.listId).toBe(1);
      expect(result.description).toBe('Updated task');
      expect(result.completed).toBe(false);
    });

    it('should throw an error if the item does not exist', () => {
      expect(() => {
        service.update(1, 999, { description: 'Should fail' });
      }).toThrowError('Item not found');
    });

    it('should throw an error when trying to update completed status from update()', () => {
      const dto = {
        description: 'Still valid',
        completed: true, // this field should not be allowed in update
      };

      expect(() => {
        service.update(1, 1, dto);
      }).toThrowError('You cannot update completion status from this endpoint');
    });
  });

  describe('setCompleted', () => {
    beforeEach(() => {
      // Add a task to be marked as completed
      service.create(1, { description: 'Incomplete task' });
    });

    it('should mark the item as completed', () => {
      const result = service.setCompleted(1);
      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(result.completed).toBe(true);
    });

    it('should throw an error if the item does not exist', () => {
      expect(() => {
        service.setCompleted(999);
      }).toThrowError('Item not found');
    });
  });

  describe('delete', () => {
    beforeEach(() => {
      service.create(1, { description: 'Task to delete' });
    });

    it('should delete the todo item with the given id and listId', () => {
      service.delete(1, 1);

      expect(service['todoItems']).toHaveLength(0);
    });

    it('should throw an error if the item does not exist', () => {
      expect(() => {
        service.delete(1, 999);
      }).toThrowError('Item not found');
    });
  });

  describe('findById', () => {
    beforeEach(() => {
      service.create(1, { description: 'Task 1' });
      service.create(1, { description: 'Task 2' });
    });

    it('should return the item with the given ID', () => {
      const item = service.findById(2);
      expect(item).toBeDefined();
      expect(item?.description).toBe('Task 2');
    });

    it('should return undefined if the item does not exist', () => {
      const item = service.findById(999);
      expect(item).toBeUndefined();
    });
  });
});
