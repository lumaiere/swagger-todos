# Swagger Todos API Demo

This is a simple Express API with Swagger (OpenAPI) documentation. It demonstrates how to build a small CRUD API with interactive docs at `/docs`.

## Features
- Express.js server with CRUD routes for Todos
- Swagger UI at `/docs` for interactive API exploration
- In-memory data store (for demo only)
- Example of code-first Swagger integration using `swagger-jsdoc` and `swagger-ui-express`

## Requirements
- Node.js 18+
- npm

## Setup

```bash
git clone https://github.com/lumaiere/swagger-todos.git
cd swagger-todos
npm install
```

## Running the server

```bash
node index.js
```

Server will start at: `http://localhost:3000`  
Swagger docs at: `http://localhost:3000/docs`

## Example Endpoints

- `GET /api/todos` - List all todos
- `GET /api/todos/:id` - Get one todo
- `POST /api/todos` - Create a new todo
- `PATCH /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Remove a todo

## Notes
- This is a demo project for learning Swagger/OpenAPI with Express.
- Not production-ready (data is in-memory).
