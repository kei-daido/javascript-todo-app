let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";
let currentSearch = "";
let currentCategoryFilter = "all";

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  tasks.forEach(function (task, index) {
    if (currentFilter === "active" && task.completed) {
      return;
    }

    if (currentFilter === "completed" && !task.completed) {
      return;
    }

    if (
      currentCategoryFilter !== "all" &&
      (task.category || "other") !== currentCategoryFilter
    ) {
      return;
    }

    if (!task.text.toLowerCase().includes(currentSearch.toLowerCase())) {
      return;
    }

    const li = document.createElement("li");
    li.textContent = task.text;

    const prioritySpan = document.createElement("span");
    prioritySpan.textContent = `【${getPriorityLabel(task.priority)}】`;
    prioritySpan.className = `priority priority-${task.priority || "normal"}`;

    li.appendChild(prioritySpan);

    if (task.dueDate) {
      const dueDateSpan = document.createElement("span");
      dueDateSpan.textContent = `期限：${task.dueDate}`;
      dueDateSpan.className = "due-date";

      if (task.dueDate < getTodayString() && !task.completed) {
        dueDateSpan.classList.add("overdue");
      }

      li.appendChild(dueDateSpan);
    }

    const categorySpan = document.createElement("span");
    categorySpan.textContent = `カテゴリ：${getCategoryLabel(task.category)}`;
    categorySpan.className = "category";

    li.appendChild(categorySpan);

    if (task.completed) {
      li.classList.add("completed");
    }

    const completeButton = document.createElement("button");
    completeButton.textContent = "完了";

    completeButton.onclick = function () {
      tasks[index].completed = !tasks[index].completed;
      saveTasks();
      renderTasks();
    };

    const editButton = document.createElement("button");
    editButton.textContent = "編集";

    editButton.onclick = function () {
      const newText = prompt("新しいタスク名を入力してください", task.text);

      if (newText === null) {
        return;
      }

      if (newText.trim() === "") {
        return;
      }

      tasks[index].text = newText.trim();
      saveTasks();
      renderTasks();
    };

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "削除";
    deleteButton.className = "delete-button";

    deleteButton.onclick = function () {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    };

    li.appendChild(completeButton);
    li.appendChild(editButton);
    li.appendChild(deleteButton);
    taskList.appendChild(li);
  });
}

function getPriorityLabel(priority) {
  if (priority === "high") {
    return "高";
  }

  if (priority === "normal") {
    return "中";
  }

  if (priority === "low") {
    return "低";
  }

  return "中";
}

function getCategoryLabel(category) {
  if (category === "study") {
    return "学習";
  }

  if (category === "work") {
    return "仕事";
  }

  if (category === "life") {
    return "生活";
  }

  if (category === "other") {
    return "その他";
  }

  return "その他";
}

function getTodayString() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const date = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${date}`;
}

const taskInput = document.getElementById("taskInput");
const priorityInput = document.getElementById("priorityInput");
const dueDateInput = document.getElementById("dueDateInput");
const categoryInput = document.getElementById("categoryInput");

function addTask() {
  const taskText = taskInput.value.trim();

  if (taskText === "") {
    return;
  }

  tasks.push({
    text: taskText,
    completed: false,
    priority: priorityInput.value,
    dueDate: dueDateInput.value,
    category: categoryInput.value,
  });

  saveTasks();
  renderTasks();

  taskInput.value = "";
  priorityInput.value = "normal";
  dueDateInput.value = "";
  categoryInput.value = "other";
}

function sortTasks() {
  tasks.sort(function (a, b) {
    if (a.completed === b.completed) {
      return 0;
    }

    if (a.completed === false && b.completed === true) {
      return -1;
    }

    if (a.completed === true && b.completed === false) {
      return 1;
    }
  });

  saveTasks();
  renderTasks();
}

function sortByPriority() {
  const priorityOrder = {
    high: 1,
    normal: 2,
    low: 3,
  };

  tasks.sort(function (a, b) {
    const priorityA = priorityOrder[a.priority || "normal"];
    const priorityB = priorityOrder[b.priority || "normal"];

    return priorityA - priorityB;
  });

  saveTasks();
  renderTasks();
}

function sortByDueDate() {
  tasks.sort(function (a, b) {
    const dueDateA = a.dueDate || "9999-12-31";
    const dueDateB = b.dueDate || "9999-12-31";

    if (dueDateA === dueDateB) {
      return 0;
    }

    if (dueDateA < dueDateB) {
      return -1;
    }

    if (dueDateA > dueDateB) {
      return 1;
    }
  });

  saveTasks();
  renderTasks();
}

function setFilter(filter) {
  currentFilter = filter;
  renderTasks();
}

taskInput.onkeydown = function (event) {
  if (event.key === "Enter") {
    addTask();
  }
};

const searchInput = document.getElementById("searchInput");

searchInput.oninput = function () {
  currentSearch = searchInput.value;
  renderTasks();
};

const categoryFilterInput = document.getElementById("categoryFilterInput");

categoryFilterInput.onchange = function () {
  currentCategoryFilter = categoryFilterInput.value;
  renderTasks();
};

renderTasks();
