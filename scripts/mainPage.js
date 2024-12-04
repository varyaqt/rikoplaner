import { 
  stackList, 
  checkFullStack, 
  sortStackList, 
  deleteTaskFromStackList
} from "../data/stackList.js";

// Импортируем функции для аутентификации из auth.js
import { loginUser, getUserById } from './autorizationForm.js';

// calendar
new AirDatepicker('#airdatepicker', {
  inline: true
});

// make a default value of calendar input as a today's date
const today = new Date();
const day = today.getDate();
const month = today.getMonth() + 1; 
const year = today.getFullYear();
const formattedDate = `${day}.${month}.${year}`;

const calendarInputElement = document.getElementById('airdatepicker');
calendarInputElement.value = `${formattedDate}`;

const inputElement = document.getElementById('inputToStack');
const placeholderImage = document.querySelector('.js-add-stack-icon');
const inputContainer = document.querySelector('.js-add-todo-to-stack');
const addToStackButtonElement = document.getElementById('addStackButton');
const taskInStackElement = document.querySelector('.js-todo-container-stack');

renderStackList();

// определяем размер стека
function updateSizeStack() {
  const sizeStackElement = document.querySelector('.js-size-stack');
  sizeStackElement.innerHTML = `${stackList.length}/10`;
};

// проверяем заполненность стэка
function checkInputStackAvailable() {
  const sizeStackElement = document.querySelector('.js-size-stack');
  if (checkFullStack() === true) {
    inputElement.classList.remove('input-active');
    inputElement.classList.add('not-active-input-stack');
    sizeStackElement.style.color = 'rgb(122, 25, 25)';
    inputElement.placeholder = 'Стек переполнен';
    inputElement.disabled = true;
    placeholderImage.style.display = 'none';
  } else {
    sizeStackElement.style.color = 'rgb(60,91,120)';
    inputElement.classList.remove('not-active-input-stack');
    inputElement.placeholder = 'Добавить в стек';
    inputElement.disabled = false;
  };
};

// генерация списка задач в стеке
function renderStackList() {
  const stackListElement = document.querySelector('.js-stack-list-container');
  sortStackList();
  let html = ``;
  stackList.forEach((element) => {
    html += `
      <div class="todo-container-stack js-task-in-stack" task-id="${element.id}">
        <div class="task-name" id="taskNameId${element.id}">${element.name}</div>
        <button class="task-done-button js-task-done-button" task-id="${element.id}">Выполнено</button>
        <button class="delete-task-button js-delete-task-button" task-id="${element.id}">Удалить</button>
      </div>
    `;
  });
  stackListElement.innerHTML = html;

  checkInputStackAvailable();
  updateSizeStack();

  // Добавляем обработчики событий для кнопок удаления
  const deleteTaskButtonElements = document.querySelectorAll('.js-delete-task-button');
  deleteTaskButtonElements.forEach(button => {
    button.addEventListener('click', (event => {
      const taskId = Number(event.target.getAttribute('task-id'));
      removeTaskfromStack(taskId);
    }));
  });

  // Добавляем обработчики событий для кнопок "Выполнено"
  const doneTasksButtonElements = document.querySelectorAll('.js-task-done-button');
  doneTasksButtonElements.forEach(button => {
    button.addEventListener('click', (event => {
      const taskId = Number(event.target.getAttribute('task-id'));
      completeTaskInStack(taskId);
    }));
  });
};

// добавление новой задачи в стек
function addTaskToStack(taskName) {
  let taskId = 0;
  if (stackList.length !== 0) {
    taskId = Number(stackList[0].id) + 1;
  } else if (stackList.length === 0) {
    taskId = 1;
  }
  const newTask = {
    id: taskId,
    name: taskName
  };
  stackList.push(newTask);
  renderStackList();
  inputElement.value = '';
}

// удаление задачи из стека
function removeTaskfromStack(taskId) {
  deleteTaskFromStackList(taskId);
  renderStackList();
}

// пометка задачи как выполненной в стеке
function completeTaskInStack(taskId) {
  const taskNameElement = document.getElementById(`taskNameId${taskId}`);
  taskNameElement.style.textDecoration = 'line-through';
  setTimeout(() => {
    removeTaskfromStack(taskId);
  }, 1000);
}

// Скрываем плюсик при фокусе на поле ввода
inputElement.addEventListener('focus', () => {
  placeholderImage.classList.add('unvisible-input-img');
  inputElement.classList.add('input-active');
  addToStackButtonElement.style.display = 'block';
});


// Показываем изображение, если поле ввода пустое и не в фокусе
inputElement.addEventListener('blur', () => {
  if (inputElement.value === '') {
    placeholderImage.classList.remove('unvisible-input-img');
    inputElement.classList.remove('input-active');
    addToStackButtonElement.style.display = 'none';
  }
});

// добавление задачи в стэк при нажатии кнопки или enter
addToStackButtonElement.addEventListener('click', () => {
  const newTask = inputElement.value;
  if (newTask !== '') {
    addTaskToStack(newTask);
  }
});

inputElement.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    const newTask = inputElement.value;
    if (newTask !== '') {
      addTaskToStack(newTask);
    }
  }
});

// // Форма для аутентификации
// const loginFormElement = document.getElementById('loginForm');
// loginFormElement.addEventListener('submit', (event) => {
//   event.preventDefault(); // Предотвращаем отправку формы

//   let username = document.getElementById('username').value;
//   let password = document.getElementById('password').value;

//   loginUser(username, password)
//     .then(data => {
//       console.log('Login successful:', data);
//       // Получаем данные пользователя по _id
//       const user_id = data.user_id; // Предположим, что user_id возвращается в ответе
//       return getUserById(user_id);
//     })
//     .then(userData => {
//       console.log('User data:', userData);
//       // Здесь вы можете использовать данные пользователя
//     })
//     .catch(error => {
//       console.error('Error:', error);
//       alert('Ошибка аутентификации.');
//     });
// });

// // Получение данных пользователя по _id
// const token = localStorage.getItem('access_token');
// const user_id = "670e41bb6f607c8857583ee3";  // Замените на реальный _id пользователя

// fetch(`http://127.0.0.1:8000/users/${user_id}`, {
//     method: 'GET',
//     headers: {
//         'Authorization': `Bearer ${token}`
//     }
// })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }
//         return response.json();
//     })
//     .then(data => {
//         console.log('User data:', data);
//         // Здесь вы можете использовать данные пользователя
//     })
//     .catch(error => console.error('Error:', error));