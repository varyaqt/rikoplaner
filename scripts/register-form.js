
const registrationFormElement = document.getElementById('registrationForm')
registrationFormElement.addEventListener('submit', async (event) => 
  {
    event.preventDefault(); // Предотвращаем отправку формы

    // проверка на то, что в поле "подтверждения пароля" введен такой же пароль
    let password = document.getElementsByName('password')[0].value;
    let confirmPassword = document.getElementsByName('confirm_password')[0].value;

    if (password !== confirmPassword) {
      alert("Пароли не совпадают!");
      event.preventDefault(); // Предотвращаем отправку формы
    }

    // Собираем данные с формы
    const formData = new FormData(event.target);
    console.log(Array.from(formData.entries()))

    try {
      const response = await fetch('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        alert('Аккаунт успешно создан!');
        window.location.href = 'login.html'; // Перенаправление на страницу входа
      } else {
        const errorData = await response.json();
        alert(`Ошибка: ${errorData.detail}`);
      }
    } catch (error) {
      console.error('Ошибка при отправке данных:', error);
      alert('Произошла ошибка при отправке данных. Пожалуйста, попробуйте снова.');
    }
});


