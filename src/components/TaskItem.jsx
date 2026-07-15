function TaskItem({ task, onEdit, onDelete, onToggleComplete }) {
  return (
    <li className={task.completed ? 'task-item completed' : 'task-item'}>
      <div className="task-info">
        <h3>{task.title}</h3>
        {task.description && <p>{task.description}</p>}
        <p>
          Due: {task.dueDate || 'None'} | Priority: {task.priority} |{' '}
          {task.completed ? 'Completed' : 'Incomplete'}
        </p>
      </div>

      <div className="task-actions">
        <button type="button" onClick={() => onToggleComplete(task.id)}>
          {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
        </button>
        <button type="button" onClick={() => onEdit(task)}>
          Edit
        </button>
        <button type="button" onClick={() => onDelete(task.id)}>
          Delete
        </button>
      </div>
    </li>
  );
}

export default TaskItem;
