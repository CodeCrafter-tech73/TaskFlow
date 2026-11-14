import TaskItem from './TaskItem.jsx';

function TaskList({
  tasks,
  onEdit,
  onDelete,
  onToggleComplete,
}) {
  if (tasks.length === 0) {
    return (
      <p className="empty-message">
        No tasks match the current search or filters.
      </p>
    );
  }

  return (
    <ul className="task-list" aria-label="Task list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleComplete={onToggleComplete}
        />
      ))}
    </ul>
  );
}

export default TaskList;