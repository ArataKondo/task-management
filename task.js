const STORAGE_KEY = 'watnow_tasks';
const taskInput = document.getElementById('task-input');
const taskDateInput = document.getElementById('task-date');
const taskTimeInput = document.getElementById('task-time');
const prioritySelect = document.getElementById('priority-select');
const categorySelect = document.getElementById('category-select');
const categorySwatch = document.getElementById('category-swatch');
const addButton = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');

const CATEGORY_COLOR = {
  school: '#7c9cff',
  work: '#7ff3c8',
  life: '#ffd57f',
  other: '#d5a6ff',
};

const CATEGORY_LABEL = {
  school: '学校',
  work: 'バイト',
  life: '生活',
  other: 'その他',
};

const loadTasks = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  try {
    return data ? JSON.parse(data) : [];
  } catch (error) {
    return [];
  }
};

const saveTasks = (tasks) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

const createTask = (text, priority, date, time, category, color) => ({
  id: String(Date.now()),
  text,
  completed: false,
  priority: Number(priority),
  date: date || new Date().toISOString().slice(0, 10),
  time: time || '',
  category,
  color,
});

const getPriorityLabel = (priority) => {
  if (priority === 3) return '高';
  if (priority === 2) return '中';
  return '低';
};

const renderTasks = () => {
  const tasks = loadTasks().sort((a, b) => {
    if (b.priority !== a.priority) return b.priority - a.priority;
    if (a.date !== b.date) return (a.date || '').localeCompare(b.date || '');
    return (a.time || '').localeCompare(b.time || '');
  });
  taskList.innerHTML = '';

  if (tasks.length === 0) {
    const emptyState = document.createElement('p');
    emptyState.className = 'empty-state';
    emptyState.textContent = 'まずはタスクを追加してください。';
    taskList.appendChild(emptyState);
    return;
  }

  tasks.forEach((task) => {
    const li = document.createElement('li');
    li.className = 'task-item';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => {
      const updated = loadTasks().map((item) =>
        item.id === task.id ? { ...item, completed: checkbox.checked } : item
      );
      saveTasks(updated);
      renderTasks();
    });

    const body = document.createElement('div');
    body.className = 'task-body';

    const mainText = document.createElement('div');
    mainText.className = 'task-main-text';

    const span = document.createElement('span');
    span.textContent = task.text;
    if (task.completed) {
      span.classList.add('completed');
    }

    const meta = document.createElement('div');
    meta.className = 'task-meta';
    meta.textContent = `${task.date || '日付未設定'} ${task.time || ''}`.trim();

    mainText.appendChild(span);
    mainText.appendChild(meta);

    const tagGroup = document.createElement('div');
    tagGroup.className = 'task-tags';

    const categoryLabel = document.createElement('span');
    categoryLabel.className = 'category-chip';
    categoryLabel.textContent = CATEGORY_LABEL[task.category] || 'その他';
    categoryLabel.style.background = task.color || CATEGORY_COLOR[task.category] || '#7c9cff';

    const priorityLabel = document.createElement('span');
    priorityLabel.className = `priority-badge priority-${task.priority}`;
    priorityLabel.textContent = getPriorityLabel(task.priority);

    tagGroup.appendChild(categoryLabel);
    tagGroup.appendChild(priorityLabel);
    body.appendChild(mainText);
    body.appendChild(tagGroup);

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.textContent = '削除';
    deleteBtn.addEventListener('click', () => {
      const filtered = loadTasks().filter((item) => item.id !== task.id);
      saveTasks(filtered);
      renderTasks();
    });

    li.appendChild(checkbox);
    li.appendChild(body);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });
};

const updateColorFromCategory = () => {
  const category = categorySelect.value;
  const color = CATEGORY_COLOR[category] || '#7ff3c8';
  categorySwatch.style.background = color;
  return color;
};

const addTask = () => {
  const text = taskInput.value.trim();
  const priority = Number(prioritySelect.value);
  const date = taskDateInput.value;
  const time = taskTimeInput.value;
  const category = categorySelect.value;
  const color = updateColorFromCategory();

  if (!text) {
    taskInput.focus();
    return;
  }

  const tasks = loadTasks();
  tasks.push(createTask(text, priority, date, time, category, color));
  saveTasks(tasks);
  taskInput.value = '';
  taskDateInput.value = '';
  taskTimeInput.value = '';
  prioritySelect.value = '2';
  categorySelect.value = 'work';
  updateColorFromCategory();
  renderTasks();
};

categorySelect.addEventListener('change', updateColorFromCategory);
addButton.addEventListener('click', addTask);

taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addTask();
  }
});

window.addEventListener('DOMContentLoaded', () => {
  updateColorFromCategory();
  renderTasks();
});