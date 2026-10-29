import { useState } from 'react';
import TaskForm from './components/TaskForm.jsx';
import TaskList from './components/TaskList.jsx';
import { loadTasks, saveTasks } from './services/taskStorage.js';

const SAMPLE_TASKS = [
  {
    id: crypto.randomUUID(),
    title: 'Buy groceries',
    description: 'Milk, eggs, bread, and coffee.',
    dueDate: '2026-07-20',
    priority: 'medium',
    completed: false,
  },
  {
    id: crypto.randomUUID(),
    title: 'Finish project report',
    description: 'Write the summary section and proofread.',
    dueDate: '2026-07-18',
    priority: 'high',
    completed: false,
  },
  {
    id: crypto.randomUUID(),
    title: 'Call the dentist',
    description: 'Schedule a cleaning appointment.',
    dueDate: '2026-07-25',
    priority: 'low',
    completed: true,
  },
];

function getInitialTasks() {
  const stored = loadTasks();

  if (stored === null) {
    saveTasks(SAMPLE_TASKS);
    return SAMPLE_TASKS;
  }

  return stored;
}

function App() {
  const [tasks, setTasks] = useState(getInitialTasks);
  const [editingTask, setEditingTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const matchingTasks = normalizedSearchQuery
    ? tasks.filter((task) =>
        task.title.toLowerCase().includes(normalizedSearchQuery) ||
        task.description.toLowerCase().includes(normalizedSearchQuery)
      )
    : [];
  const visibleTasks = selectedTaskId
    ? tasks.filter((task) => task.id === selectedTaskId)
    : normalizedSearchQuery
      ? matchingTasks
      : tasks;

  function handleSave(taskData) {
    let updatedTasks;

    if (editingTask) {
      updatedTasks = tasks.map((task) =>
        task.id === editingTask.id
          ? {
              ...task,
              title: taskData.title,
              description: taskData.description,
              dueDate: taskData.dueDate,
              priority: taskData.priority,
            }
          : task
      );
      setEditingTask(null);
    } else {
      const newTask = {
        id: crypto.randomUUID(),
        title: taskData.title,
        description: taskData.description,
        dueDate: taskData.dueDate,
        priority: taskData.priority,
        completed: false,
      };
      updatedTasks = [...tasks, newTask];
    }

    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  }

  function handleEdit(task) {
    setEditingTask(task);
  }

  function handleCancelEdit() {
    setEditingTask(null);
  }

  function handleDelete(id) {
    const confirmed = window.confirm('Are you sure you want to delete this task?');

    if (!confirmed) {
      return;
    }

    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);

    if (editingTask && editingTask.id === id) {
      setEditingTask(null);
    }
  }

  function handleToggleComplete(id) {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  }

  return (
    <div className="app">
      <h1>TaskFlow</h1>
      <p>A simple task manager that stores data in your browser.</p>

      <TaskForm
        onSubmit={handleSave}
        editingTask={editingTask}
        onCancel={handleCancelEdit}
      />

      <h2>Tasks</h2>
      <div
        className="form-field task-search"
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setIsSearchFocused(false);
          }
        }}
      >
        <label htmlFor="task-search">Search tasks</label>
        <input
          id="task-search"
          type="search"
          value={searchQuery}
          onFocus={() => setIsSearchFocused(true)}
          onChange={(event) => {
            setSearchQuery(event.target.value);
            setSelectedTaskId(null);
          }}
          placeholder="Search titles and descriptions"
        />
        {isSearchFocused && normalizedSearchQuery && !selectedTaskId && matchingTasks.length > 0 && (
          <ul className="task-search-suggestions" aria-label="Matching tasks">
            {matchingTasks.map((task) => (
              <li key={task.id}>
                <button
                  type="button"
                  className="task-search-suggestion"
                  onClick={() => setSelectedTaskId(task.id)}
                >
                  <span className="task-search-suggestion-title">{task.title}</span>
                  {task.description && (
                    <span className="task-search-suggestion-description">
                      {task.description}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <TaskList
        tasks={visibleTasks}
        emptyMessage={normalizedSearchQuery ? 'No matching tasks found.' : undefined}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleComplete={handleToggleComplete}
      />
      <h2>Task Completed</h2>
    </div>
  );
}

export default App;
