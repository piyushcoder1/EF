const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require("cors");


const app = express();
app.use(cors({
    origin: 'http://localhost:3000'
  }));
app.use(bodyParser.json());

const db = new sqlite3.Database(':memory:', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the tasks database.');
});

db.serialize(() => {
  db.run('CREATE TABLE tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, description TEXT, completed BOOLEAN)');
});

app.get('/tasks', (req, res) => {
  db.all('SELECT * FROM tasks', [], (err, rows) => {
    if (err) {
      throw err;
    }
    res.status(200).json(rows);
  });
});

app.post('/tasks', (req, res) => {
  const { title, description, completed } = req.body;
  db.run('INSERT INTO tasks (title, description, completed) VALUES (?, ?, ?)', [title, description, completed], function (err) {
    if (err) {
      return console.error(err.message);
    }
    res.status(201).json({ id: this.lastID, title, description, completed });
  });
});

app.put('/tasks/:id', (req, res) => {
  const { completed } = req.body;
  db.run('UPDATE tasks SET completed = ? WHERE id = ?', [completed, req.params.id], function (err) {
    if (err) {
      return console.error(err.message);
    }
    res.status(200).json({ id: req.params.id, completed });
  });
});

app.delete('/tasks/:id', (req, res) => {
  db.run('DELETE FROM tasks WHERE id = ?', req.params.id, function (err) {
    if (err) {
      return console.error(err.message);
    }
    res.status(200).json({ id: req.params.id });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));