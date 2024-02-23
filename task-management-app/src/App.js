import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const response = await axios.get('http://localhost:5000/tasks');
    setTasks(response.data);
  };

  const addTask = async () => {
    await axios.post('http://localhost:5000/tasks', { title, description });
    loadTasks();
  };

  const toggleCompleted = async (id) => {
    const task = tasks.find((task) => task.id === id);
    await axios.put(`http://localhost:5000/tasks/${id}`, { completed: !task.completed });
    loadTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:5000/tasks/${id}`);
    loadTasks();
  };

  return (
    <div className="App">
      <h1>Task Management</h1>
      <form onSubmit={(e) => {
        e.preventDefault();
        addTask();
        setTitle('');
        setDescription('');
      }}>
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <button type="submit">Add Task</button>
      </form>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <h2>{task.title}</h2>
            <p>{task.description}</p>
            <button onClick={() => toggleCompleted(task.id)}>{task.completed ? 'Mark as Incomplete' : 'Mark as Complete'}</button>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;