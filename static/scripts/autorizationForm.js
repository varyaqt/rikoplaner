// Функция для аутентификации пользователя и получения токена
export function loginUser(username, password) {
    const data = { username, password };

    return fetch('http://127.0.0.1:8000/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(data),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Access token:', data.access_token);
        // Сохраняем токен в localStorage или другом хранилище
        localStorage.setItem('access_token', data.access_token);
        return data;
    })
    .catch(error => {
        console.error('Error:', error);
        throw error;
    });
}

// Функция для получения данных пользователя по _id
export async function getUserById(user_id) {
    const token = localStorage.getItem('access_token');

    return await fetch(`http://127.0.0.1:8000/users/${user_id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('User data:', data);
        return data;
    })
    .catch(error => {
        console.error('Error:', error);
        throw error;
    });
}

// Форма для аутентификации
const loginFormElement = document.getElementById('loginForm');
loginFormElement.addEventListener('submit', async (event) => {
    event.preventDefault(); // Предотвращаем отправку формы

    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;

    await loginUser(username, password)
        .then(async data => {
            console.log('Login successful:', data);
            alert('Login successful:', data);
            // Получаем данные пользователя по _id
            const user_id = data.user_id; // Предположим, что user_id возвращается в ответе
            return await getUserById(user_id);
        })
        .then(userData => {
            console.log('User data:', userData);
            alert('User data:', userData);
            // Здесь вы можете использовать данные пользователя
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Ошибка аутентификации.');
        });
});