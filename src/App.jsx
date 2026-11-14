import { useState } from 'react';
import TaskForm from './components/TaskForm.jsx';
import TaskCalendar from './components/TaskCalendar.jsx';
import TaskList from './components/TaskList.jsx';
import { signOut } from './services/authStorage.js';
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

function getInitialTasks(userId) {
  // Load only the task data belonging to the identified user.
  const stored = loadTasks(userId);

  if (stored === null) {
    // New prototype users receive sample tasks.
    saveTasks(userId, SAMPLE_TASKS);
    return SAMPLE_TASKS;
  }

  return stored;
}

function App({ currentUserId = 'prototype-user' }) {
  // The temporary ID keeps TaskFlow working until the login system
  // provides the real logged-in user's ID.
  const [tasks, setTasks] = useState(() =>
    getInitialTasks(currentUserId)
  );
  const [editingTask, setEditingTask] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [message, setMessage] = useState('');

  function showMessage(text) {
    // Give the user clear feedback after an important action.
    setMessage(text);
  }

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
      showMessage('Task updated successfully.');
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
      showMessage('Task created successfully.');
    }

    setTasks(updatedTasks);

    // Save the updated tasks under the current user's storage key.
    saveTasks(currentUserId, updatedTasks);
  }

  function handleEdit(task) {
    setEditingTask(task);
    setMessage('');

    // Move the user back to the task form.
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  function handleCancelEdit() {
    setEditingTask(null);
    showMessage('Task editing canceled.');
  }

  function handleDelete(id) {
    const confirmed = window.confirm(
      'Are you sure you want to permanently delete this task?'
    );

    if (!confirmed) {
      return;
    }

    const updatedTasks = tasks.filter((task) => task.id !== id);

    setTasks(updatedTasks);
    saveTasks(currentUserId, updatedTasks);
    showMessage('Task deleted successfully.');

    if (editingTask && editingTask.id === id) {
      setEditingTask(null);
    }
  }

  function handleToggleComplete(id) {
    const selectedTask = tasks.find((task) => task.id === id);

    const updatedTasks = tasks.map((task) =>
      task.id === id
        ? {
            ...task,
            completed: !task.completed,
          }
        : task
    );

    setTasks(updatedTasks);
    saveTasks(currentUserId, updatedTasks);

    showMessage(
      selectedTask?.completed
        ? 'Task returned to the active list.'
        : 'Task marked as completed.'
    );
  }

  const normalizedSearch = searchText.trim().toLowerCase();

  // Search and filters help users find specific tasks.
  const visibleTasks = tasks.filter((task) => {
    const taskTitle = task.title.toLowerCase();
    const taskDescription = (task.description || '').toLowerCase();

    const matchesSearch =
      taskTitle.includes(normalizedSearch) ||
      taskDescription.includes(normalizedSearch);

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && !task.completed) ||
      (statusFilter === 'completed' && task.completed);

    const matchesPriority =
      priorityFilter === 'all' ||
      task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <main className="app">
      <header className="app-header">
        <h1>TaskFlow</h1>
        <p>
          Organize your tasks clearly and keep track of your
          progress.
        </p>
      </header>

      {message && (
        <p
          className="status-message"
          role="status"
          aria-live="polite"
        >
          {message}
        </p>
      )}
  function handleSignOut() {
    signOut();
    window.location.assign('/login.html');
  }

  return (
    <div className="app">
      <button type="button" onClick={handleSignOut}>Sign out</button>
      <h1>TaskFlow</h1>
      <p>A simple task manager that stores data in your browser.</p>

      <TaskForm
        onSubmit={handleSave}
        editingTask={editingTask}
        onCancel={handleCancelEdit}
      />

      <section
        className="task-section"
        aria-labelledby="task-list-heading"
      >
        <div className="task-heading-row">
          <h2 id="task-list-heading">Your Tasks</h2>

          <span className="task-count">
            {visibleTasks.length} shown
          </span>
        </div>

        <div className="task-controls">
          <div className="control-field search-field">
            <label htmlFor="task-search">
              Search tasks
            </label>

            <input
              id="task-search"
              type="search"
              placeholder="Search by title or description"
              value={searchText}
              onChange={(event) =>
                setSearchText(event.target.value)
              }
            />
          </div>

          <div className="control-field">
            <label htmlFor="status-filter">Status</label>

            <select
              id="status-filter"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
            >
              <option value="all">All tasks</option>
              <option value="active">Active tasks</option>
              <option value="completed">
                Completed tasks
              </option>
            </select>
          </div>

          <div className="control-field">
            <label htmlFor="priority-filter">
              Priority
            </label>

            <select
              id="priority-filter"
              value={priorityFilter}
              onChange={(event) =>
                setPriorityFilter(event.target.value)
              }
            >
              <option value="all">All priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        <TaskList
          tasks={visibleTasks}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleComplete={handleToggleComplete}
        />
      </section>
    </main>
      <TaskCalendar tasks={tasks} />

      <h2>Tasks</h2>
      <TaskList
        tasks={tasks}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleComplete={handleToggleComplete}
      />
      <h2>Task Completed</h2>
    </div>
  );
}

export default App;