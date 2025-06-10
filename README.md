# TodoList API

API REST construida con NestJS para gestionar listas de tareas (_TodoLists_) e ítems (_TodoItems_) dentro de esas listas.  
Incluye además un **servidor MCP (Model Context Protocol)** que permite la interacción a través de lenguaje natural mediante herramientas (_tools_) invocables por modelos de lenguaje como Claude o ChatGPT.

---

## Instalación y ejecución

1. Clonar el repositorio:
```bash
git clone https://github.com/blumaconi/nestjs-interview.git
cd nestjs-interview
```

2. Instalar dependencias:
```bash
npm install
```

3. Ejecutar la API en modo desarrollo:
```bash
npm run start:dev
```

4. Ejecutar el servidor MCP:
```bash
npm run start:mcp
```

> Asegurarse de tener Node.js, npm y `ts-node` instalados.

---

## Servidor MCP

El proyecto incluye un servidor MCP que expone herramientas (_tools_) invocables mediante lenguaje natural.  
Algunas de las tools disponibles:

- `createTodoItem`: crear una tarea en una lista específica.
- `updateTodoItem`: actualizar la descripción de una tarea.
- `completeTodoItem`: marcar una tarea como completada.
- `deleteTodoItem`: eliminar una tarea.

Ejemplo de prompt para usar con un cliente MCP como Claude:

> _"Crear una tarea en la lista ‘Trabajo’ con la descripción ‘Terminar informe’"_

---

## Endpoints REST desarrollados

### `TodoItems`
- `POST   /todolists/:listId/items` → Crear ítem
- `GET    /todolists/:listId/items` → Listar ítems de una lista
- `PUT    /todolists/:listId/items/:id` → Actualizar ítem
- `PATCH  /todolists/:listId/items/:id/complete` → Marcar ítem como completado
- `DELETE /todolists/:listId/items/:id` → Eliminar ítem

---

## Funcionalidades incluidas

- API RESTful organizada por módulos NestJS.
- Validación y transformación de datos con `class-validator` y `class-transformer`.
- Simulación de almacenamiento en memoria.
- Servidor MCP con herramientas invocables por lenguaje natural.
- Validación de descripción duplicada al crear tareas en una misma lista.
- Lógica separada por capas de servicios.
- Cobertura completa de tests unitarios para servicios y controladores.

---

## Tests

Para correr pruebas unitarias del proyecto:

```bash
npm run test
```

Los tests se encuentran en los archivos `.spec.ts` dentro de `src/todo_items/`.

### Notas adicionales sobre testing MCP

Se intentó implementar pruebas unitarias específicas para las herramientas MCP usando `invokeTool`, pero surgieron errores en el entorno de desarrollo.

→ Ver detalles en [`test-notes.md`](./test-notes.md).

---

## Tecnologías utilizadas

- [NestJS](https://nestjs.com/)
- TypeScript
- Node.js
- [Model Context Protocol (MCP)](https://github.com/modelcontextprotocol)
- Zod (validación en MCP tools)

---

## Estructura del proyecto

```
src/
├── app.module.ts
├── todo_lists/
│   ├── todo_lists.service.ts
│   └── ...
├── todo_items/
│   ├── todo_items.service.ts
│   └── ...
├── mcp/
│   ├── mcp-server.ts
│   └── index.ts
├── utils/
│   └── utils.ts
└── ...
```

---

## Autor

Bruno Lumaconi — [@blumaconi](https://github.com/blumaconi)
