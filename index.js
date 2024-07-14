const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());

// Get all todos
app.get('/todos', (req, res) => {
  fs.readFile('db.json', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading database file');
    }
    const todos = JSON.parse(data).todos;
    res.json(todos);
  });
});

// Add a new todo
app.post('/todos', (req, res) => {
  const newTodo = req.body;
  fs.readFile('db.json', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading database file');
    }
    const todos = JSON.parse(data).todos;
    todos.push(newTodo);
    fs.writeFile('db.json', JSON.stringify({ todos }), (err) => {
      if (err) {
        return res.status(500).send('Error writing to database file');
      }
      res.status(201).send('Todo added');
    });
  });
});

// Update status of todos with even ID
app.patch('/todos/updateEven', (req, res) => {
  fs.readFile('db.json', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading database file');
    }
    let todos = JSON.parse(data).todos;
    todos = todos.map(todo => {
      if (todo.id % 2 === 0 && todo.status === false) {
        todo.status = true;
      }
      return todo;
    });
    fs.writeFile('db.json', JSON.stringify({ todos }), (err) => {
      if (err) {
        return res.status(500).send('Error writing to database file');
      }
      res.send('Todos updated');
    });
  });
});

// Delete todos with status true
app.delete('/todos/deleteCompleted', (req, res) => {
  fs.readFile('db.json', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading database file');
    }
    let todos = JSON.parse(data).todos;
    todos = todos.filter(todo => todo.status !== true);
    fs.writeFile('db.json', JSON.stringify({ todos }), (err) => {
      if (err) {
        return res.status(500).send('Error writing to database file');
      }
      res.send('Completed todos deleted');
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
