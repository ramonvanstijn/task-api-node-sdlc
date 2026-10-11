const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '127.0.0.1';

app.use(express.json());

// In-memory data store for baseline demo
const tasks = [
  { id: 1, title: 'Setup repository', description: 'Initialize git and GitHub repo with Node.js 24 & pnpm', completed: true },
  { id: 2, title: 'Connect IBM Bob', description: 'Install Bob extension and authenticate', completed: true }
];

// Helper to reset state in tests
app.resetState = () => {
  tasks.length = 0;
  tasks.push(
    { id: 1, title: 'Setup repository', description: 'Initialize git and GitHub repo with Node.js 24 & pnpm', completed: true },
    { id: 2, title: 'Connect IBM Bob', description: 'Install Bob extension and authenticate', completed: true }
  );
};

// GET /tasks - List all tasks, optionally filtered by ?completed=true|false
app.get('/tasks', (req, res) => {
  const { completed } = req.query;

  if (completed === undefined) {
    return res.json(tasks);
  }

  if (completed !== 'true' && completed !== 'false') {
    return res.status(400).json({ error: 'completed must be "true" or "false"' });
  }

  const isCompleted = completed === 'true';
  res.json(tasks.filter((t) => t.completed === isCompleted));
});

// PATCH /tasks/:id/complete - Mark a task as completed
app.patch('/tasks/:id/complete', (req, res) => {
  const task = tasks.find((t) => t.id === Number(req.params.id));

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  task.completed = true;
  res.json(task);
});

// POST /tasks - Create a new task
app.post('/tasks', (req, res) => {
  const { id, title, description } = req.body;

  if (!id || !title) {
    return res.status(400).json({ error: 'id and title are required fields' });
  }

  const exists = tasks.some((t) => t.id === Number(id));
  if (exists) {
    return res.status(400).json({ error: 'Task with this ID already exists' });
  }

  const newTask = {
    id: Number(id),
    title: String(title),
    description: description ? String(description) : '',
    completed: false
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

if (require.main === module) {
  app.listen(PORT, HOST, () => {
    console.log(`Task API server running on http://${HOST}:${PORT} (Node.js ${process.version})`);
  });
}

module.exports = app;