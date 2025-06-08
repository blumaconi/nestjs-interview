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
          text: `Task "${description}" created in the list ${listName}.`,
        },
      ],
    };
  },
);
