
const registrationFormElement = document.getElementById('registrationForm')
registrationFormElement.addEventListener('submit', (event) => 
  {
    event.preventDefault(); // Предотвращаем отправку формы

    let username = document.getElementById('username').value;
    let secretWord = document.getElementById('secretWord').value;
    let password = document.getElementById('password').value;
    let confirmPassword = document.getElementById('confirmPassword').value;

    // проверка на то, что в поле "подтверждения пароля" введен такой же пароль
    if (password !== confirmPassword) {
      alert("Пароли не совпадают!");
      return;
    }

    // проверка длины пароля
    if (password.length < 8) {
      alert("Пароль должен состоять минимум из 8 символов!");
      return;
    }
    
    // Собираем данные с формы
  const data = { username, password, secretWord }

  fetch('/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  .then(response => response.json())
  .then(data => {
    console.log('Server response:', data); // Отладка ответа от сервера

    // проверка, что объект user существует в ответе
    if (data.user) {
      console.log('Fegistration successful');
      window.location.href = './login.html'; // Перенаправление на страницу входа
    } else {
      alert('Ошибка регистрации.')
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Ошибка регистрации.')
  });
});
