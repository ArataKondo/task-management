const STORAGE_KEY = 'watnow_tasks';
const pendingList = document.getElementById('pending-list');
const completionFill = document.getElementById('completion-fill');
const completionText = document.getElementById('completion-text');
const completedCount = document.getElementById('completed-count');
const pendingCount = document.getElementById('pending-count');
const footerButton = document.querySelector('footer button');

const getPriorityLabel = (priority) => {
  if (priority === 3) return '高';
  if (priority === 2) return '中';
  return '低';
};

const getPriorityClass = (priority) => {
  return `priority-${priority}`;
};

const loadTasks = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  try {
    return data ? JSON.parse(data) : [];
  } catch (error) {
    return [];
  }
};

const renderHome = () => {
  const tasks = loadTasks();
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const pending = tasks.filter((task) => !task.completed);
  const rate = total === 0 ? 0 : Math.round((completed / total) * 100);

  completionText.textContent = `${rate}%`;
  completionFill.style.width = `${rate}%`;
  completedCount.textContent = `完了 ${completed} / ${total}`;
  pendingCount.textContent = `${pending.length} 件`;
  pendingList.innerHTML = '';

  if (pending.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'empty-state';
    empty.textContent = '未消化タスクはありません。';
    pendingList.appendChild(empty);
    return;
  }

  pending
    .sort((a, b) => b.priority - a.priority || a.id.localeCompare(b.id))
    .forEach((task) => {
      const li = document.createElement('li');
      li.className = 'pending-item';

      const title = document.createElement('span');
      title.className = 'pending-task-title';
      title.textContent = task.text;

      const badge = document.createElement('span');
      badge.className = `priority-badge ${getPriorityClass(task.priority)}`;
      badge.textContent = getPriorityLabel(task.priority);

      li.appendChild(title);
      li.appendChild(badge);
      pendingList.appendChild(li);
    });
};

window.addEventListener('DOMContentLoaded', renderHome);