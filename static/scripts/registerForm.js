const registrationFormElement = document.getElementById('registrationForm');
registrationFormElement.addEventListener('submit', (event) => {
  event.preventDefault(); // Предотвращаем отправку формы

  let username = document.getElementById('username').value;
  let secret_word = document.getElementById('secretWord').value;
  let password = document.getElementById('password').value;
  let confirmPassword = document.getElementById('confirmPassword').value;

  // Проверка на то, что в поле "подтверждения пароля" введен такой же пароль
  if (password !== confirmPassword) {
    alert("Пароли не совпадают!");
    return;
  }

  // Проверка длины пароля
  if (password.length < 8) {
    alert("Пароль должен состоять минимум из 8 символов!");
    return;
  }

  // Собираем данные с формы
  const data = { username, password, secret_word };

  fetch('http://127.0.0.1:8000/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    console.log('Server response:', data); // Отладка ответа от сервера

    // Проверка, что объект user существует в ответе
    if (data.user_id) {
      console.log('Registration successful');
      window.location.href = '/login'; // Перенаправление на страницу входа
    } else {
      alert('Ошибка регистрации.');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Ошибка регистрации.');
  });
});