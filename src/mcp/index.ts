import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { server } from './mcp-server';

const trasport = new StdioServerTransport();

(async () => {
  await server.connect(trasport);
})();
