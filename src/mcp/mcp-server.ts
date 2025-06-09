import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { TodoItemsService } from '../todo_items/todo_items.service';
import { TodoListsService } from '../todo_lists/todo_lists.service';

const todoListsService = new TodoListsService();
const todoItemsService = new TodoItemsService();

export const server = new McpServer({
  name: 'TodoList MCP Server',
  version: '1.0.0',
});

server.tool(
  'createTodoItem',
  'Add a task to an existing list by providing its name and a task description.',
  {
    listName: z.string(),
    description: z.string(),
  },
  async ({ listName, description }) => {
    const list = await todoListsService.findByName(listName);

    if (!list) {
      throw new Error(`The list "${listName}" does not exist`);
    }

    const duplicate = todoItemsService
      .findAll(list.id)
      .find((item) => item.description === description);

    if (duplicate) {
      throw new Error(
        `A task with the description "${description}" already exists in the list "${listName}"`,
      );
    }

    await todoItemsService.create(list.id, { description });

    return {
      content: [
        {
          type: 'text',
          text: `Task "${description}" created in the list ${listName}`,
        },
      ],
    };
  },
);

server.tool(
  'updateTodoItem',
  'Update the description of an existing task in a given list by its name.',
  {
    listName: z.string(),
    currentDescription: z.string(),
    newDescription: z.string(),
  },
  async ({ listName, currentDescription, newDescription }) => {
    const list = await todoListsService.findByName(listName);
    if (!list) {
      throw new Error(`The list "${listName}" does not exist`);
    }

    const allItems = todoItemsService.findAll(list.id);

    const item = allItems.find(
      (item) => item.description === currentDescription,
    );
    if (!item) {
      throw new Error(
        `No task found with description "${currentDescription}" in the list "${listName}"`,
      );
    }

    if (currentDescription === newDescription) {
      return {
        content: [
          {
            type: 'text',
            text: `No changes applied: the new description is the same as the current one`,
          },
        ],
      };
    }

    const dumplicate = allItems.find(
      (item) => item.description === newDescription,
    );
    if (dumplicate) {
      throw new Error(
        `A task with the description "${newDescription}" already exists in the list "${listName}"`,
      );
    }

    await todoItemsService.update(list.id, item.id, {
      description: newDescription,
    });

    return {
      content: [
        {
          type: 'text',
          text: `Task "${currentDescription}" updated to "${newDescription}" in the list ${listName}`,
        },
      ],
    };
  },
);

server.tool(
  'completeTodoItem',
  'Mark an existing task as completed by its description and the name of the list it belongs to.',
  {
    listName: z.string(),
    description: z.string(),
  },
  async ({ listName, description }) => {
    const list = await todoListsService.findByName(listName);
    if (!list) {
      throw new Error(`The list "${listName}" does not exist`);
    }

    const item = todoItemsService
      .findAll(list.id)
      .find((item) => item.description === description);

    if (!item) {
      throw new Error(
        `No task found with description "${description}" in the list "${listName}"`,
      );
    }

    if (item.completed) {
      return {
        content: [
          {
            type: 'text',
            text: `The task "${description}" is already marked as completed`,
          },
        ],
      };
    }

    await todoItemsService.setCompleted(item.id);

    return {
      content: [
        {
          type: 'text',
          text: `Task "${description}" marked as completed in the list ${listName}`,
        },
      ],
    };
  },
);
