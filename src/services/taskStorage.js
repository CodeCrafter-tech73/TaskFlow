const STORAGE_KEY = 'taskflow-tasks';

export function loadTasks() {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (stored === null) {
    return null;
  }

  return JSON.parse(stored);
}

export function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}
