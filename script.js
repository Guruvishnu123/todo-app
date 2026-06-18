const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const emptyState = document.getElementById('emptyState');
const filterBtns = document.querySelectorAll('.filter-btn');
const totalTodosSpan = document.getElementById('totalTodos');
const completedTodosSpan = document.getElementById('completedTodos');

let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
  renderTodos();
  updateStats();
});

addBtn.addEventListener('click', addTodo);

todoInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addTodo();
  }
});

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderTodos();
  });
});

function addTodo() {
  const text = todoInput.value.trim();

  if (text === '') {
    alert('Please enter a task!');
    return;
  }

  const newTodo = {
    id: Date.now(),
    text: text,
    completed: false,
    createdAt: new Date().toLocaleString()
  };

  todos.push(newTodo);
  saveTodos();
  renderTodos();
  updateStats();
  todoInput.value = '';
  todoInput.focus();
}

function deleteTodo(id) {
  todos = todos.filter(todo => todo.id !== id);
  saveTodos();
  renderTodos();
  updateStats();
}

function toggleComplete(id) {
  const todo = todos.find(t => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    saveTodos();
    renderTodos();
    updateStats();
  }
}

function renderTodos() {
  todoList.innerHTML = '';

  let filteredTodos = todos;

  if (currentFilter === 'active') {
    filteredTodos = todos.filter(todo => !todo.completed);
  } else if (currentFilter === 'completed') {
    filteredTodos = todos.filter(todo => todo.completed);
  }

  if (filteredTodos.length === 0) {
    emptyState.classList.remove('hidden');
    return;
  }

  emptyState.classList.add('hidden');

  filteredTodos.forEach(todo => {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;

    li.innerHTML = `
      <input 
        type="checkbox" 
        class="checkbox" 
        ${todo.completed ? 'checked' : ''}
        onchange="toggleComplete(${todo.id})"
      />
      <span class="todo-text">${escapeHtml(todo.text)}</span>
      <button class="delete-btn" onclick="deleteTodo(${todo.id})">Delete</button>
    `;

    todoList.appendChild(li);
  });
}

function updateStats() {
  const total = todos.length;
  const completed = todos.filter(todo => todo.completed).length;

  totalTodosSpan.textContent = total;
  completedTodosSpan.textContent = completed;
}

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
