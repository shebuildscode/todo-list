const form = document.querySelector(".input-group");
const input = document.querySelector(".new-todo-input");
const listContainer = document.querySelector(".todos");
const previewTodo = listContainer.querySelector(".preview-todo");
const list = JSON.parse(localStorage.getItem("todos")) || [];
let currList = [];
const selectList = document.querySelector(".form-select");
let editInput = document.createElement("input");
let todo = "";
let preEditText = "";

const showList = (listToShow = list) => {
  if (listToShow.length > 0) listContainer.innerHTML = listToShow.join("");
  else if (selectList.value === "all")
    listContainer.innerHTML = previewTodo.outerHTML;
  else
    listContainer.innerHTML = `<div class="preview-todo my-1 px-2 py-1 w-100 d-flex justify-content-between align-items-center text-bg-primary">
      <p class="mb-0"><span class="todo-span">This list is empty</span></p></div>`;
};

showList();

const doneTodos = () => {
  return list.filter((li) => {
    if (li.includes("checked")) return li;
  });
};

const undoneTodos = () => {
  return list.filter((li) => {
    if (!li.includes("checked")) return li;
  });
};

const currentList = (selectedValue = selectList.value) => {
  if (selectedValue === "all") return list;
  else if (selectedValue === "done") return doneTodos();
  else if (selectedValue === "undone") return undoneTodos();
};

currList = currentList();

const setStorage = () => {
  localStorage.setItem("todos", JSON.stringify(list));
};

const getStorage = () => {
  return JSON.parse(localStorage.getItem("todos")) || [];
};

const generateTodoHTML = (element, isChecked, todoId) => {
  return `<div
          class="todo my-1 px-2 py-1 w-100 d-flex justify-content-between align-items-center text-bg-primary" data-id='${
            todoId || Date.now()
          }'
        >
          <p class="mb-0">${element}</p>
          <div class="d-flex align-items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-arrow-up"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5"
              />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-arrow-down"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1"
              />
            </svg>
            <button class="btn-close"></button>
            <div class="form-check form-check-reverse">
            <input class="form-check-input" type="checkbox" value="" id="reverseCheck1" ${
              isChecked ? "checked" : ""
            }></div>
            </div>
            </div>`;
};

const generateSpan = (todoText, isChecked = false, todoId) => {
  const span = `<span class='todo-span'>${todoText}</span>`;
  return generateTodoHTML(span, isChecked, todoId);
};

const generateInput = (todoText, isChecked = false, todoId) => {
  const input = `<input type='text' class='form-control todo-input' aria-label="Small" aria-describedby="inputGroup-sizing-sm" value='${todoText}'  autofocus>`;
  return generateTodoHTML(input, isChecked, todoId);
};

const setStorageShowList = (listToShow = list) => {
  setStorage();
  showList(listToShow);
};

const findIndex = (todoId, currList = list) =>
  currList.indexOf(currList.filter((todo) => todo.includes(todoId))[0]);

const addTodo = (todo) => {
  const todoHTML = generateSpan(todo);
  list.unshift(todoHTML);
  selectList.value = "all";
  setStorageShowList();
};

const deleteTodo = (todoId) => {
  const index = findIndex(todoId);
  list.splice(index, 1);
  setStorageShowList(currentList());
};

const moveUp = (todoId, currList = list) => {
  const currIndex = findIndex(todoId, currList);
  if (currIndex > 0) {
    let currEl = currList[currIndex];
    currList[currIndex] = currList[currIndex - 1];
    currList[currIndex - 1] = currEl;
    setStorageShowList(currList);
  }
};

const moveDown = (todoId, currList = list) => {
  const currIndex = findIndex(todoId, currList);
  if (currIndex < currList.length - 1) {
    currEl = currList[currIndex];
    currList[currIndex] = currList[currIndex + 1];
    currList[currIndex + 1] = currEl;
    setStorageShowList(currList);
  }
};

const closeExistingInput = () => {
  if (editInput.classList.contains("todo-input")) {
    const savedList = getStorage() || [];
    list.forEach((_, i) => (list[i] = savedList[i]));
    currList = currentList();
    showList(currList);
    editInput = document.createElement("input");
  }
};

const editTodo = (todoId, todoText, isChecked) => {
  closeExistingInput();
  preEditText = todoText;
  const index = findIndex(todoId);
  const currIndex = findIndex(todoId, currList);
  currList[currIndex] = generateInput(todoText, isChecked, todoId);
  showList(currList);
  editInput = listContainer.querySelector(".todo-input");
  editInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && this.value !== "") {
      list[index] = generateSpan(
        this.value,
        this.closest(".todo")
          .querySelector(".form-check-input")
          .hasAttribute("checked"),
        todoId
      );
      currList[currIndex] = list[index];
      setStorageShowList(currList);
      editInput = document.createElement("input");
    }
    if (e.key === "Escape") closeExistingInput();
  });
};

const checkTodo = (todoId, todoText, isChecked) => {
  closeExistingInput();
  const index = findIndex(todoId);
  list[index] = generateSpan(todoText, isChecked, todoId);
  const currListIndex = findIndex(todoId, currList);
  currList[currListIndex] = generateSpan(todoText, isChecked, todoId);
  setStorageShowList(currList);
};

const isCheckedFunc = (checkbox, parentTodo) => {
  checkbox.toggleAttribute("checked");
  const isChecked = checkbox.hasAttribute("checked");
  const todoText = parentTodo.querySelector(".todo-input")
    ? preEditText
    : parentTodo.innerText;
  checkTodo(parentTodo.dataset.id, todoText, isChecked);
};

input.addEventListener("input", () => (todo = input.value));

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (todo.trim() !== "") addTodo(todo);
  todo = "";
  input.value = "";
});

document.querySelector("body").addEventListener("dblclick", function (e) {
  e.preventDefault();
  if (e.target === this) closeExistingInput();
});

listContainer.addEventListener("dblclick", (e) => {
  e.preventDefault();
  const parentTodo = e.target.closest(".todo");
  if (e.target.querySelector(".todo-span") || e.target.closest(".todo-span")) {
    editTodo(
      parentTodo.dataset.id,
      parentTodo.innerText,
      parentTodo.querySelector(".form-check-input").hasAttribute("checked")
    );
  }
});

listContainer.addEventListener("click", (e) => {
  e.preventDefault();
  const parentTodo = e.target.closest(".todo");
  if (e.target.closest(".btn-close")) deleteTodo(parentTodo.dataset.id);
  if (e.target.closest(".bi-arrow-up")) moveUp(parentTodo.dataset.id, currList);
  if (e.target.closest(".bi-arrow-down"))
    moveDown(parentTodo.dataset.id, currList);
  if (e.target.closest(".form-check-input"))
    isCheckedFunc(e.target.closest(".form-check-input"), parentTodo);
});

selectList.addEventListener("change", (e) => {
  closeExistingInput();
  const selectedValue = e.target.value;
  currList = currentList(selectedValue);
  showList(currList);
  if (selectedValue === "all") form.classList.remove("hidden");
  else form.classList.add("hidden");
});
