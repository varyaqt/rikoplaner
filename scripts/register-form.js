// проверка на то, что в поле "подтверждения пароля" введен такой же пароль
const registrationFormElement = document.getElementById('registrationForm')
registrationFormElement.addEventListener('submit', event => 
  {
    let password = document.getElementsByName('password')[0].value;
    let confirmPassword = document.getElementsByName('confirm_password')[0].value;

    if (password !== confirmPassword) {
      alert("Пароли не совпадают!");
      event.preventDefault(); // Предотвращаем отправку формы
    }
});

function handleFormSubmit(event) {
  // Просим форму не отправлять данные самостоятельно
  event.preventDefault()
  console.log('Отправка!')
}

registrationFormElement.addEventListener('submit', handleFormSubmit)