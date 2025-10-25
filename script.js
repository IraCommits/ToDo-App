const form = document.getElementById("todoForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const counter = document.getElementById("counter");
const clearCompletedBtn = document.getElementById("clearCompleted");
const filters = document.querySelectorAll(".filter");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";

  const filteredTasks = tasks.filter((task) => {
    if (currentFilter === "active") return !task.done;
    if (currentFilter === "completed") return task.done;
    return true;
  });

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");
    if (task.done) li.classList.add("completed");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;

    const span = document.createElement("span");
    span.textContent = task.text;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-btn");

    checkbox.addEventListener("change", () => {
      task.done = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    deleteBtn.addEventListener("click", () => {
      li.classList.add("fade-out");
      setTimeout(() => {
        tasks.splice(tasks.indexOf(task), 1);
        saveTasks();
        renderTasks();
      }, 300);
    });

    li.append(checkbox, span, deleteBtn);
    taskList.append(li);
  });

  if (filteredTasks.length === 0) {
    taskList.innerHTML = `
  <li style="
    text-align: center;
    color: gray;
    list-style: none;
    padding: 15px;
    font-style: italic;
  ">
    There is nothing to show
  </li>`;
  }

  const activeCount = tasks.filter((task) => !task.done).length;
  counter.textContent = `Active: ${activeCount}`;

  saveTasks();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = taskInput.value.trim();
  if (!text) return;

  tasks.push({ text, done: false });
  taskInput.value = "";
  renderTasks();
});

filters.forEach((btn) => {
  btn.addEventListener("click", () => {
    filters.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

function clearCompleted() {
  tasks = tasks.filter((task) => !task.done);
  saveTasks();
  renderTasks();
}

clearCompletedBtn.addEventListener("click", () => {
  const completedItems = document.querySelectorAll("#taskList li.completed");

  if (completedItems.length === 0) return;

  completedItems.forEach((li) => li.classList.add("fade-out"));

  setTimeout(() => {
    clearCompleted();
  }, 300);
});

renderTasks();
