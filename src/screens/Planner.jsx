import React, { useState, useEffect } from 'react';

function Planner() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ subject: '', topic: '', due: '' });

  useEffect(() => {
    const savedTasks = localStorage.getItem('studyTasks');
    if (savedTasks) setTasks(JSON.parse(savedTasks));
  }, []);

  useEffect(() => {
    localStorage.setItem('studyTasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleInputChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const addTask = () => {
    if (!newTask.subject || !newTask.topic || !newTask.due) return;

    const task = { ...newTask, completed: false };
    setTasks((prev) => [...prev, task]);
    setNewTask({ subject: '', topic: '', due: '' });
  };

  const toggleCompleted = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
  };

  const today = new Date().toISOString().slice(0, 10);
  const todayTasks = tasks
    .filter(task => task.due.slice(0, 10) === today)
    .sort((a, b) => new Date(a.due) - new Date(b.due));

  const pending = todayTasks.filter(t => !t.completed);
  const completed = todayTasks.filter(t => t.completed);

  const clearAllTasks = () => {
    if (confirm('Clear all tasks?')) setTasks([]);
  };

  return (
<div style={{
  padding: '2rem',
  backgroundColor: '#161b22',        // ✨ Beautiful dark background
  color: '#f5f5f5',
  minHeight: '100vh',
  fontFamily: 'Segoe UI, sans-serif',
  
}}>

      <h2 style={{ color: '#90caf9', marginBottom: '1rem' }}>📘 Daily Study Planner</h2>

      {/* ───── Add Task Form ───── */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
        marginBottom: '2rem',
        alignItems: 'center'
      }}>
        <input
          name="subject"
          placeholder="Subject"
          value={newTask.subject}
          onChange={handleInputChange}
          style={inputStyle}
        />
        <input
          name="topic"
          placeholder="Topic"
          value={newTask.topic}
          onChange={handleInputChange}
          style={inputStyle}
        />
        <input
          name="due"
          type="datetime-local"
          value={newTask.due}
          onChange={handleInputChange}
          style={inputStyle}
        />
        <button onClick={addTask} style={primaryBtn}>➕ Add</button>
        {tasks.length > 0 && (
          <button onClick={clearAllTasks} style={dangerBtn}>🗑️ Clear All</button>
        )}
      </div>

      {/* ───── Pending Tasks ───── */}
      <Section title="🕒 Pending Tasks" tasks={pending} toggleCompleted={toggleCompleted} />

      {/* ───── Completed Tasks ───── */}
      <Section title="✅ Completed Tasks" tasks={completed} toggleCompleted={toggleCompleted} />
    </div>
  );
}

function Section({ title, tasks, toggleCompleted }) {
  return (
    <>
      <h3 style={{ color: '#64b5f6', marginBottom: '0.5rem' }}>{title}</h3>
      {tasks.length === 0 ? (
        <p style={{ color: '#aaa', marginBottom: '1.5rem' }}>No tasks here.</p>
      ) : (
        <ul style={{ listStyle: 'none', paddingLeft: 0, marginBottom: '2rem' }}>
          {tasks.map((task, idx) => (
            <li key={idx} style={taskItemStyle}>
              <label style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleCompleted(task.index)}
                  style={{ transform: 'scale(1.2)' }}
                />
                <div>
                  <span style={badge}>{task.subject}</span>
                  <div>{task.topic}</div>
                  <small style={{ color: '#ccc' }}>
                    Due: {new Date(task.due).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </small>
                </div>
              </label>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

const inputStyle = {
  backgroundColor: '#1e1e1e',
  color: '#f5f5f5',
  border: '1px solid #555',
  padding: '0.5rem',
  flex: '1 1 150px',
};

const primaryBtn = {
  backgroundColor: '#1976d2',
  color: '#fff',
  border: 'none',
  padding: '0.5rem 1rem',
  cursor: 'pointer',
  borderRadius: '4px'
};

const dangerBtn = {
  backgroundColor: '#d32f2f',
  color: '#fff',
  border: 'none',
  padding: '0.5rem 1rem',
  cursor: 'pointer',
  borderRadius: '4px'
};

const taskItemStyle = {
  backgroundColor: '#1e1e1e',
  padding: '0.75rem 1rem',
  borderRadius: '8px',
  marginBottom: '0.75rem',
  border: '1px solid #333',
  transition: '0.3s',
};

const badge = {
  display: 'inline-block',
  backgroundColor: '#0288d1',
  color: '#fff',
  borderRadius: '8px',
  padding: '0.2rem 0.6rem',
  marginBottom: '0.25rem',
  fontSize: '0.75rem'
};

export default Planner;
