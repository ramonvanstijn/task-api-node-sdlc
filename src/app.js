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

// GET /tasks - List all tasks
app.get('/tasks', (req, res) => {
  res.json(tasks);
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