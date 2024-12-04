// Функция для аутентификации пользователя и получения токена
function loginUser(username, password) {
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
function getUserById(user_id) {
    const token = localStorage.getItem('access_token');

    return fetch(`http://127.0.0.1:8000/users/${user_id}`, {
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

// Экспортируем функции, чтобы их можно было использовать в других файлах
export { loginUser, getUserById };