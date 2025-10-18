const STORAGE_KEY = 'tasks_v1_muha_app';

const taskForm = document.getElementById('taskForm');
const taskIdInput = document.getElementById('taskId');
const nameInput = document.getElementById('taskName');
const courseInput = document.getElementById('taskCourse');
const deadlineInput = document.getElementById('taskDeadline');
const tasksList = document.getElementById('tasksList');
const searchInput = document.getElementById('searchInput');
const filterCourse = document.getElementById('filterCourse');
const filterStatus = document.getElementById('filterStatus');
const incompleteCountEl = document.getElementById('incompleteCount');
const noTasksMsg = document.getElementById('noTasksMsg');
const clearAllBtn = document.getElementById('clearAllBtn');
const exportBtn = document.getElementById('exportBtn');
const importFile = document.getElementById('importFile');
const resetBtn = document.getElementById('resetBtn');


const errName = document.getElementById('errName');
const errDeadline = document.getElementById('errDeadline');

let tasks = [];

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function loadTasks() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error('Gagal membaca data tasks:', e);
    return [];
  }
}

function isValidDateString(dateStr) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  return !isNaN(d.getTime());
}

function formatDateISO(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '-';
  return d.toLocaleDateString();
}

function renderCourseOptions() {
  const courses = Array.from(new Set(tasks.map(t => (t.course || '').trim()).filter(Boolean))).sort();
  filterCourse.innerHTML = '<option value="">Semua Mata Kuliah</option>';
  courses.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    filterCourse.appendChild(opt);
  });
}

function renderTasks() {
  const q = (searchInput.value || '').toLowerCase().trim();
  const courseFilter = filterCourse.value;
  const statusFilter = filterStatus.value;

  let visible = tasks.filter(t => {
    if (courseFilter && (t.course || '') !== courseFilter) return false;
    if (statusFilter === 'complete' && !t.completed) return false;
    if (statusFilter === 'incomplete' && t.completed) return false;
    if (q) {
      const inName = (t.name || '').toLowerCase().includes(q);
      const inCourse = (t.course || '').toLowerCase().includes(q);
      return inName || inCourse;
    }
    return true;
  });

  visible.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

  tasksList.innerHTML = '';

  if (visible.length === 0) {
    noTasksMsg.classList.remove('hidden');
  } else {
    noTasksMsg.classList.add('hidden');
  }

  visible.forEach(task => {
    const li = document.createElement('li');
    li.className = 'p-3 border rounded flex items-start justify-between gap-3';

    const left = document.createElement('div');
    left.className = 'flex items-start gap-3';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = !!task.completed;
    checkbox.className = 'mt-1';
    checkbox.addEventListener('change', () => toggleComplete(task.id));

    const info = document.createElement('div');
    info.className = 'text-sm';

    const title = document.createElement('div');
    title.className = 'font-medium';
    title.textContent = task.name;
    if (task.completed) title.classList.add('line-through', 'text-slate-400');

    const meta = document.createElement('div');
    meta.className = 'text-xs text-slate-500';
    meta.textContent = `${task.course || '-'} • Deadline: ${formatDateISO(task.deadline)}`;

    info.appendChild(title);
    info.appendChild(meta);

    left.appendChild(checkbox);
    left.appendChild(info);

    const actions = document.createElement('div');
    actions.className = 'flex gap-2 items-center';

    const editBtn = document.createElement('button');
    editBtn.className = 'text-sm px-2 py-1 border rounded hover:bg-gray-50';
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => startEdit(task.id));

    const delBtn = document.createElement('button');
    delBtn.className = 'text-sm px-2 py-1 border rounded text-red-600 hover:bg-red-50';
    delBtn.textContent = 'Hapus';
    delBtn.addEventListener('click', () => deleteTask(task.id));

    actions.appendChild(editBtn);
    actions.appendChild(delBtn);

    li.appendChild(left);
    li.appendChild(actions);

    tasksList.appendChild(li);
  });

  const incompleteCount = tasks.filter(t => !t.completed).length;
  incompleteCountEl.textContent = incompleteCount;

  renderCourseOptions();
}

function addTask(data) {
  const newTask = {
    id: uid(),
    name: data.name.trim(),
    course: (data.course || '').trim(),
    deadline: data.deadline,
    completed: false,
    createdAt: new Date().toISOString(),
  };
  tasks.push(newTask);
  saveTasks();
  renderTasks();
}

function updateTask(id, data) {
  const i = tasks.findIndex(t => t.id === id);
  if (i === -1) return false;
  tasks[i].name = data.name.trim();
  tasks[i].course = (data.course || '').trim();
  tasks[i].deadline = data.deadline;
  saveTasks();
  renderTasks();
  return true;
}

function toggleComplete(id) {
  const t = tasks.find(x => x.id === id);
  if (!t) return;
  t.completed = !t.completed;
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  if (!confirm('Yakin ingin menghapus tugas ini?')) return;
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

function clearAll() {
  if (!confirm('Hapus semua tugas (tidak dapat dibatalkan)?')) return;
  tasks = [];
  saveTasks();
  renderTasks();
}

function startEdit(id) {
  const t = tasks.find(x => x.id === id);
  if (!t) return;
  taskIdInput.value = t.id;
  nameInput.value = t.name;
  courseInput.value = t.course;
  deadlineInput.value = t.deadline;
  nameInput.focus();
}

function validateFormValues(name, deadline) {
  let ok = true;
  if (!name || !name.trim()) {
    errName.classList.remove('hidden');
    ok = false;
  } else {
    errName.classList.add('hidden');
  }

  if (!isValidDateString(deadline)) {
    errDeadline.textContent = 'Deadline tidak valid atau kosong.';
    errDeadline.classList.remove('hidden');
    ok = false;
  } else {
    const d = new Date(deadline);
    const today = new Date();
    today.setHours(0,0,0,0);
    d.setHours(0,0,0,0);
    if (d < today) {
      errDeadline.textContent = 'Deadline harus hari ini atau setelahnya.';
      errDeadline.classList.remove('hidden');
      ok = false;
    } else {
      errDeadline.classList.add('hidden');
    }
  }

  return ok;
}

taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const id = taskIdInput.value;
  const name = nameInput.value;
  const course = courseInput.value;
  const deadline = deadlineInput.value;

  if (!validateFormValues(name, deadline)) return;

  if (id) {
    updateTask(id, { name, course, deadline });
    taskIdInput.value = '';
  } else {
    addTask({ name, course, deadline });
  }

  taskForm.reset();
  errName.classList.add('hidden');
  errDeadline.classList.add('hidden');
});

resetBtn.addEventListener('click', () => {
  taskForm.reset();
  taskIdInput.value = '';
  errName.classList.add('hidden');
  errDeadline.classList.add('hidden');
});

searchInput.addEventListener('input', () => renderTasks());
filterCourse.addEventListener('change', () => renderTasks());
filterStatus.addEventListener('change', () => renderTasks());

clearAllBtn.addEventListener('click', clearAll);

exportBtn.addEventListener('click', () => {
  const dataStr = JSON.stringify(tasks, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'tasks-export.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
});

importFile.addEventListener('change', (e) => {
  const f = e.target.files[0];
  if (!f) return;
  const reader = new FileReader();
  reader.onload = function(ev) {
    try {
      const imported = JSON.parse(ev.target.result);
      if (!Array.isArray(imported)) throw new Error('Format tidak sesuai');
      const sanitized = imported.map(it => ({
        id: it.id || uid(),
        name: it.name || '(Unnamed)',
        course: it.course || '',
        deadline: it.deadline || '',
        completed: !!it.completed,
        createdAt: it.createdAt || new Date().toISOString(),
      }));
      tasks = sanitized;
      saveTasks();
      renderTasks();
      importFile.value = '';
      alert('Impor berhasil');
    } catch (err) {
      alert('Gagal impor: ' + err.message);
    }
  };
  reader.readAsText(f);
});

function init() {
  tasks = loadTasks();
  renderTasks();
}

init();
