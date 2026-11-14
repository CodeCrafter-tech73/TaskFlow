function TaskItem({ task, onEdit, onDelete, onToggleComplete }) {
  return (
    <li className={task.completed ? 'task-item completed' : 'task-item'}>
      <div className="task-info">
        <div className="task-title-row">
          <h3>{task.title}</h3>
          <span className={`priority-badge priority-${task.priority}`}>
            {task.priority} priority
          </span>
        </div>

        {task.description && <p>{task.description}</p>}

        <p className="task-details">
          <span>Due: {task.dueDate || 'No due date'}</span>
          <span className="task-status">
            Status: {task.completed ? 'Completed' : 'Active'}
          </span>
        </p>
      </div>

      <div className="task-actions">
        <button
          className="primary-button"
          type="button"
          onClick={() => onToggleComplete(task.id)}
        >
          {task.completed ? 'Mark Active' : 'Mark Complete'}
        </button>

        <button
          className="secondary-button"
          type="button"
          onClick={() => onEdit(task)}
        >
          Edit
        </button>

        <button
          className="delete-button"
          type="button"
          onClick={() => onDelete(task.id)}
        >
          Delete
        </button>
      </div>
    </li>
  );
}

export default TaskItem;
