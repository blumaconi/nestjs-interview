### Intento de testear el servidor MCP usando `invokeTool`

Durante la implementación de los tests para las herramientas del servidor MCP, intenté utilizar el método `invokeTool` recomendado por la documentación del SDK `@modelcontextprotocol/sdk`. Esta función permite simular la invocación de una tool como si fuera llamada por un modelo de lenguaje (LLM), lo cual es ideal para testear la integración completa del protocolo MCP.

#### Pasos realizados

- Instalé el SDK necesario con:
  ```bash
  npm install @modelcontextprotocol/sdk
  ```

- Intenté importar el helper de testing usando:
  ```ts
  import { createToolTestServer } from '@modelcontextprotocol/sdk/testing';
  ```

- Para que TypeScript pudiera reconocer el módulo, modifiqué el archivo `tsconfig.json` agregando las siguientes opciones:
  ```json
  "moduleResolution": "node",
  "esModuleInterop": true,
  "allowSyntheticDefaultImports": true
  ```

- Reinicié el servidor de TypeScript en VSCode (`Cmd + Shift + P → Restart TS Server`) para forzar la recarga de configuración.

#### Problemas encontrados

A pesar de los pasos anteriores, el entorno TypeScript siguió marcando errores en las importaciones del módulo de testing:

- **TS2307**: `Cannot find module '@modelcontextprotocol/sdk/testing'`
- **TS2551**: `Property 'invokeTool' does not exist on type 'McpServer'`

Verifiqué también posibles errores de tipeo, reinicié el editor e intenté cambiar las rutas de importación, pero el error siguió.

#### Conclusión

Me hubiera gustado poder resolver este problema para completar los tests con `invokeTool`, ya que representa una forma más realista de probar la lógica completa de cada herramienta. Sin embargo, requiere más tiempo de investigación sobre la configuración avanzada del SDK y cómo exponer correctamente las herramientas en el servidor MCP.
