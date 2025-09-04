// index.js
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const app = express();
app.use(express.json());

// ---- In-memory data store (for demo only) ----
let todos = [
  { id: 1, title: 'Buy coffee', done: false },
  { id: 2, title: 'Write blog', done: true }
];

// ---- Swagger/OpenAPI configuration ----
const swaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: 'Todos API (Demo)',
    version: '1.0.0',
    description: 'A minimal Express API documented with OpenAPI via swagger-jsdoc.'
  },
  servers: [{ url: 'http://localhost:3000', description: 'Local dev' }],
  components: {
    schemas: {
      Todo: {
        type: 'object',
        required: ['id', 'title', 'done'],
        properties: {
          id: { type: 'integer', example: 3 },
          title: { type: 'string', example: 'Refill coffee beans' },
          done: { type: 'boolean', example: false }
        }
      },
      NewTodo: {
        type: 'object',
        required: ['title'],
        properties: {
          title: { type: 'string', example: 'Stretch break' }
        }
      }
    }
  }
};

const options = {
  definition: swaggerDefinition,
  apis: ['./index.js'] // <-- this file contains our JSDoc annotations
};

const swaggerSpec = swaggerJSDoc(options);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @openapi
 * /api/todos:
 *   get:
 *     summary: List all todos
 *     tags: [Todos]
 *     responses:
 *       200:
 *         description: Array of todos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Todo'
 */
app.get('/api/todos', (req, res) => res.json(todos));

/**
 * @openapi
 * /api/todos/{id}:
 *   get:
 *     summary: Get a single todo
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: Numeric ID of the todo
 *     responses:
 *       200:
 *         description: A todo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       404:
 *         description: Not found
 */
app.get('/api/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id === Number(req.params.id));
  if (!todo) return res.status(404).json({ message: 'Not found' });
  res.json(todo);
});

/**
 * @openapi
 * /api/todos:
 *   post:
 *     summary: Create a new todo
 *     tags: [Todos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewTodo'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 */
app.post('/api/todos', (req, res) => {
  const nextId = Math.max(0, ...todos.map(t => t.id)) + 1;
  const newTodo = { id: nextId, title: req.body.title || 'Untitled', done: false };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

/**
 * @openapi
 * /api/todos/{id}:
 *   patch:
 *     summary: Update fields on a todo
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: 'string' }
 *               done: { type: 'boolean' }
 *     responses:
 *       200:
 *         description: Updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       404:
 *         description: Not found
 */
app.patch('/api/todos/:id', (req, res) => {
  const i = todos.findIndex(t => t.id === Number(req.params.id));
  if (i === -1) return res.status(404).json({ message: 'Not found' });
  todos[i] = { ...todos[i], ...req.body };
  res.json(todos[i]);
});

/**
 * @openapi
 * /api/todos/{id}:
 *   delete:
 *     summary: Remove a todo
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204:
 *         description: Deleted
 *       404:
 *         description: Not found
 */
app.delete('/api/todos/:id', (req, res) => {
  const before = todos.length;
  todos = todos.filter(t => t.id !== Number(req.params.id));
  if (todos.length === before) return res.status(404).json({ message: 'Not found' });
  res.status(204).end();
});

app.listen(3000, () => {
  console.log('API running on http://localhost:3000');
  console.log('Docs at http://localhost:3000/docs');
});
