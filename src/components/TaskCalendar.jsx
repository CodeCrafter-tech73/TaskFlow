import { useState } from 'react';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function TaskCalendar({ tasks, onRemoveTask }) {
  const [month, setMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const monthLabel = month.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
  const gridStart = new Date(
    month.getFullYear(),
    month.getMonth(),
    1 - firstDay.getDay()
  );
  const days = Array.from({ length: 42 }, (_, index) => {
    const day = new Date(gridStart);
    day.setDate(gridStart.getDate() + index);
    return day;
  });
  const tasksByDate = tasks.reduce((groupedTasks, task) => {
    if (task.dueDate) {
      if (!groupedTasks[task.dueDate]) {
        groupedTasks[task.dueDate] = [];
      }
      groupedTasks[task.dueDate].push(task);
    }
    return groupedTasks;
  }, {});

  function changeMonth(offset) {
    setMonth((currentMonth) =>
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1)
    );
  }

  function showCurrentMonth() {
    const today = new Date();
    setMonth(new Date(today.getFullYear(), today.getMonth(), 1));
  }

  return (
    <section className="task-calendar" aria-labelledby="calendar-title">
      <div className="calendar-toolbar">
        <h2 id="calendar-title">Calendar</h2>
        <div className="calendar-controls">
          <button type="button" aria-label="Previous month" onClick={() => changeMonth(-1)}>
            &larr;
          </button>
          <button type="button" className="calendar-today" onClick={showCurrentMonth}>
            Today
          </button>
          <button type="button" aria-label="Next month" onClick={() => changeMonth(1)}>
            &rarr;
          </button>
        </div>
      </div>
      <p className="calendar-month" aria-live="polite">{monthLabel}</p>
      <div className="calendar-grid" role="group" aria-label={monthLabel}>
        {WEEKDAYS.map((weekday) => (
          <div className="calendar-weekday" key={weekday}>
            {weekday}
          </div>
        ))}
        {days.map((day) => {
          const dateKey = toDateKey(day);
          const dayTasks = tasksByDate[dateKey] || [];
          const isToday = dateKey === toDateKey(new Date());
          const isCurrentMonth = day.getMonth() === month.getMonth();

          return (
            <div
              className={`calendar-day${isToday ? ' is-today' : ''}${isCurrentMonth ? '' : ' outside-month'}`}
              key={dateKey}
            >
              <span className="calendar-date">{day.getDate()}</span>
              <div className="calendar-tasks">
                {dayTasks.slice(0, 3).map((task) => (
                  <div className="calendar-task-row" key={task.id}>
                    <span
                      className={`calendar-task priority-${task.priority}${task.completed ? ' is-completed' : ''}`}
                      title={task.title}
                    >
                      {task.title}
                    </span>
                    <button
                      type="button"
                      className="calendar-task-remove"
                      aria-label={`Remove ${task.title} from calendar`}
                      onClick={() => onRemoveTask(task.id)}
                    >
                      &times;
                    </button>
                  </div>
                ))}
                {dayTasks.length > 3 && (
                  <span className="calendar-more">+{dayTasks.length - 3} more</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default TaskCalendar;