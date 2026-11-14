// This helper creates a different browser-storage key for each TaskFlow user.
// It keeps one user's tasks from being mixed with another user's tasks.
function getStorageKey(userId) {
  return `taskflow-tasks-${userId}`;
}

export function loadTasks(userId) {
  // Task data should not be loaded when there is no identified user.
  if (!userId) {
    return null;
  }

  // Retrieve only the tasks saved for the identified user.
  const storageKey = getStorageKey(userId);
  const stored = localStorage.getItem(storageKey);

  // Return null when this user has no saved tasks yet.
  if (stored === null) {
    return null;
  }

  try {
    // Convert the saved text back into usable task data.
    return JSON.parse(stored);
  } catch (error) {
    // Invalid saved data will not be allowed to crash TaskFlow.
    // Returning null lets the application start normally instead.
    console.error('Unable to load the saved tasks:', error);
    return null;
  }
}

export function saveTasks(userId, tasks) {
  // Task data should not be saved without an identified user.
  if (!userId) {
    return;
  }

  // Save the tasks under the identified user's individual storage key.
  const storageKey = getStorageKey(userId);
  localStorage.setItem(storageKey, JSON.stringify(tasks));
}
