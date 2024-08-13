// Функция для заполнения модального окна перед удалением пользователя
function deleteModal(id) {
    fetch(`http://localhost:8053/admin/${id}`)
        .then(res => res.json())
        .then(userDelete => {
            // Заполняем поля модального окна данными пользователя
            document.getElementById('deleteId').value = userDelete.id;
            document.getElementById('deleteName').value = userDelete.name;
            document.getElementById('deleteLastName').value = userDelete.lastName;
            document.getElementById('deleteAge').value = userDelete.age;
            document.getElementById('deleteEmail').value = userDelete.email;
            // Преобразование ролей для отображения в списке
            const rolesSelect = document.getElementById('rolesDelete');
            rolesSelect.innerHTML = ''; // Очищаем текущие элементы в списке
            userDelete.roles.forEach(role => {
                const option = document.createElement('option');
                option.text = role.name.replace('ROLE_', ''); // Убираем префикс ROLE_
                option.value = role.id; // Устанавливаем значение
                rolesSelect.add(option); // Добавляем опцию в список
            });
        })
        .catch(error => console.error('Error fetching user for delete:', error));
}

// Обработчик события для отправки формы удаления пользователя
document.getElementById('deleteModalId').addEventListener('submit', (event) => {
    event.preventDefault(); // Предотвращаем отправку формы по умолчанию

    // Получаем ID пользователя для удаления
    const userId = document.getElementById('deleteId').value;

    // Отправляем запрос на удаление пользователя
    fetch(`http://localhost:8053/admin/${userId}/delete`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        }
    })
        .then(() => {
            // Закрываем модальное окно после успешного удаления
            $('#deleteModal').modal('hide');
            // Обновляем таблицу пользователей после удаления
            getUsersTable();
        })
        .catch(error => console.error('Error deleting user:', error));
});

// Пример вызова функции deleteModal(id) при клике на кнопку "Delete"
function deleteModalExample() {
    const userIdToDelete = 1; // Замените на ID пользователя, которого хотите удалить
    deleteModal(userIdToDelete);
    $('#deleteModal').modal('show'); // Открываем модальное окно
}

// Получение списка пользователей и отображение в таблице
function getUsersTable() {
    fetch('http://localhost:8053/admin/table')
        .then(response => response.json())
        .then(users => {
            let res = '';
            users.forEach(user => {
                const roles = user.roles.map(role => role.name.replace('ROLE_', '')).join(' ');
                res += `<tr>
                            <td>${user.id}</td>
                            <td>${user.name}</td>
                            <td>${user.lastName}</td>
                            <td>${user.age}</td>
                            <td>${user.email}</td>
                            <td>${roles}</td>
                            <td>
                                <button type="button" class="btn btn-info" data-toggle="modal" data-target="#editModal" onclick="editModal(${user.id})">Edit</button>
                            </td>
                            <td>
                                <button class="btn btn-danger" data-toggle="modal" data-target="#deleteModal" onclick="deleteModal(${user.id})">Delete</button>
                            </td>
                        </tr>`;
            });
            document.getElementById('tableUsers').innerHTML = res;
        })
        .catch(error => console.error('Error fetching users table:', error));
}

// Загрузка информации об администраторе
async function getAdminInfo() {
    try {
        const temp = await fetch('http://localhost:8053/admin/auth');
        const user = await temp.json();
        getAdmin(user);
        getAdminNavBar(user);
    } catch (error) {
        console.error('Error fetching admin info:', error);
    }
}

function getAdminNavBar(user) {
    const rolesNavBar = user.roles.map(role => role.name.replace('ROLE_', '')).join(' ');
    document.getElementById('headerUsername').innerHTML = user.username;
    document.getElementById('headerUserRoles').innerHTML = rolesNavBar;
}

function getAdmin(user) {
    const roles = user.roles.map(role => role.name.replace('ROLE_', '')).join(' ');
    const temp =
        `<tr>
          <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.lastName}</td>
            <td>${user.age}</td>
            <td>${user.email}</td>
            <td>${roles}</td>
         </tr>`;
    document.getElementById('userInfoId').innerHTML = temp;
}

// Вызов функций при загрузке страницы
getAdminInfo();
getUsersTable();

// Редактирование пользователя
function editModal(id) {
    fetch(`http://localhost:8053/admin/${id}`)
        .then(res => res.json())
        .then(userEdit => {
            document.getElementById('editId').value = userEdit.id;
            document.getElementById('editFirstName').value = userEdit.firstName;
            document.getElementById('editLastName').value = userEdit.lastName;
            document.getElementById('editAge').value = userEdit.age;
            document.getElementById('editEmail').value = userEdit.email;
            // Преобразование ролей для отображения в форме
            const roles = userEdit.roles.map(role => role.id.toString());
            $('#rolesEdit').val(roles);
        })
        .catch(error => console.error('Error fetching user for edit:', error));
}

document.getElementById('modalEditId').addEventListener('submit', (event) => {
    event.preventDefault();
    const roles = $("#rolesEdit").val().map(role => {
        return {
            id: parseInt(role),
            firstName: role === '1' ? 'ROLE_USER' : 'ROLE_ADMIN',
            authority: role === '1' ? 'ROLE_USER' : 'ROLE_ADMIN'
        };
    });

    fetch(`http://localhost:8053/admin/${document.getElementById('editId').value}/edit`, {
        credentials: 'include',
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: parseInt(document.getElementById('editId').value),
            firstName: document.getElementById('editFirstName').value,
            lastName: document.getElementById('editLastName').value,
            age: document.getElementById('editAge').value,
            email: document.getElementById('editEmail').value,
            password: document.getElementById('editPassword').value,
            roles: roles
        })
    })
        .then(() => {
            $('#editModal').modal('hide');
            getUsersTable();
        })
        .catch(error => console.error('Error editing user:', error));
});

// Добавление нового пользователя
document.getElementById('newUserFormId').addEventListener('submit', (event) => {
    event.preventDefault();
    const rolesNew = Array.from(document.getElementById('rolesNew').selectedOptions).map(option => {
        return {
            id: parseInt(option.value),
            firstName: option.value === '1' ? 'ROLE_USER' : 'ROLE_ADMIN',
            authority: option.value === '1' ? 'ROLE_USER' : 'ROLE_ADMIN'
        };
    });

    fetch('http://localhost:8053/admin/create', {
        credentials: 'include',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            firstName: document.getElementById('newFirstName').value,
            lastName: document.getElementById('newLastName').value,
            age: document.getElementById('newAge').value,
            email: document.getElementById('newEmail').value,
            password: document.getElementById('newPassword').value,
            roles: rolesNew
        })
    })
        .then(() => {
            document.getElementById('usersTableTab').click();
            document.getElementById('newUserFormId').reset();
            getUsersTable();
        })
        .catch(error => console.error('Error creating new user:', error));
});