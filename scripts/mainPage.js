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


// скрываем плюсик, когда пользователь вводит новою задачу
const inputElement = document.getElementById('inputToStack');
const placeholderImage = document.querySelector('.add-stack-icon');
const inputContainer = document.querySelector('.add-todo-to-stack');
const addToStackButtonElement = document.getElementById('addStackButton');


// Скрываем изображение при фокусе на поле ввода
inputElement.addEventListener('input', () => {
  placeholderImage.style.display = 'none';
  if (inputElement.value.trim() !== '') {
    // Убираем левый padding, если поле ввода не пустое
    inputElement.style.paddingLeft = '8px';
    inputElement.style.borderTopRightRadius = 0;
    inputElement.style.borderBottomRightRadius = 0;
    addToStackButtonElement.style.display = 'block';
    inputElement.classList.add('input-active');
  } 
});


  // Показываем изображение, если поле ввода пустое и не в фокусе
  inputElement.addEventListener('blur', () => {
    if (inputElement.value === '') {
      placeholderImage.style.display = 'block';
      inputElement.style.paddingLeft = '95px';
      addToStackButtonElement.style.display = 'none';
      inputElement.style.borderTopRightRadius = '30px';
      inputElement.style.borderBottomRightRadius = '30px';
      inputElement.classList.remove('input-active');
    }
  });

function addTaskToStack() {
  
};

  // добавление задачи в стэк при нажатии кнопки или enter
  addToStackButtonElement.addEventListener('click', () => {
    addTaskToStack();
  });

  addToStackButtonElement.addEventListener('keydown', (event) => {
    if (event.key == 'Enter') {
      addTaskToStack();
    }
  });


