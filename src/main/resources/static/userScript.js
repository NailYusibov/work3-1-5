async function fetchRoles() {
    let response = await fetch('http://localhost:8080/user/roles');
    return await response.json();
}

async function populateRolesSelect(selectElementId) {
    let roles = await fetchRoles();
    let selectElement = document.getElementById(selectElementId);
    selectElement.innerHTML = ''; // Очистка текущих опций

    roles.forEach(role => {
        let option = document.createElement('option');
        option.value = role.id;
        option.text = role.name.replace('ROLE_', ''); // Убираем префикс ROLE_
        selectElement.add(option);
    });
}

async function getAdminInfo() {
    let response = await fetch('http://localhost:8080/user/auth');
    let user = await response.json();
    let username = user.username;
    let roles = user.roles;
    getAdmin(user);
    getAdminNavBar({ username, roles });
}

function getAdminNavBar({ username, roles }) {
    let rolesNavBar = roles.map(role => role.name.replace('ROLE_', '')).join(" ");
    document.getElementById('headerUsername').textContent = username;
    document.getElementById('headerUserRoles').textContent = rolesNavBar;
}

function getAdmin(user) {
    let roles = user.roles.map(role => role.name.replace('ROLE_', '')).join(" ");
    let userInfoHtml = `
        <tr>
          <td>${user.id}</td>
          <td>${user.username}</td>
          <td>${user.firstName}</td>
          <td>${user.lastName}</td>
          <td>${user.age}</td>
          <td>${user.email}</td>
          <td>${roles}</td>
        </tr>`;
    document.getElementById('userInfoId').innerHTML = userInfoHtml;
}

void getAdminInfo();

async function getUsersTable() {
    fetch('http://localhost:8080/user/table')
        .then(response => response.json())
        .then(users => {
            let usersTableHtml = users.map(user => {
                let roles = user.roles.map(role => role.name.replace('ROLE_', '')).join(" ");
                return `
                <tr>
                  <td>${user.id}</td>
                  <td>${user.username}</td>
                  <td>${user.firstName}</td>
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
            }).join('');
            document.getElementById('tableUsers').innerHTML = usersTableHtml;
        });
}

getUsersTable();

async function editModal(id) {
    await populateRolesSelect('rolesEdit'); // Заполнение ролей
    fetch(`http://localhost:8080/user/${id}`)
        .then(response => response.json())
        .then(userEdit => {
            document.getElementById('editId').value = userEdit.id;
            document.getElementById('editName').value = userEdit.username;
            document.getElementById('editFirstName').value = userEdit.firstName;
            document.getElementById('editLastName').value = userEdit.lastName;
            document.getElementById('editAge').value = userEdit.age;
            document.getElementById('editEmail').value = userEdit.email;
        });
}

document.getElementById('modalEditId').addEventListener('submit', (event) => {
    event.preventDefault();

    let roles = Array.from(document.getElementById('rolesEdit').selectedOptions).map(option => ({
        id: parseInt(option.value),
        name: option.text,
        authority: option.text
    }));

    fetch(`http://localhost:8080/user/${document.getElementById('editId').value}/edit`, {
        method: 'PATCH',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            id: document.getElementById('editId').value,
            username: document.getElementById('editName').value,
            firstName: document.getElementById('editFirstName').value,
            lastName: document.getElementById('editLastName').value,
            age: document.getElementById('editAge').value,
            email: document.getElementById('editEmail').value,
            password: document.getElementById('editPassword').value,
            roles: roles
        })
    }).then(() => {
        $('#editModal').modal('hide');
        getUsersTable();
    });
});

async function deleteModal(id) {
    await populateRolesSelect('rolesDelete'); // Заполнение ролей
    fetch(`http://localhost:8080/user/${id}`)
        .then(response => response.json())
        .then(userDelete => {
            document.getElementById('deleteId').value = userDelete.id;
            document.getElementById('deleteName').value = userDelete.username;
            document.getElementById('deleteFirstName').value = userDelete.firstName;
            document.getElementById('deleteLastName').value = userDelete.lastName;
            document.getElementById('deleteAge').value = userDelete.age;
            document.getElementById('deleteEmail').value = userDelete.email;
            document.getElementById('rolesDelete').innerHTML = userDelete.roles.map(role => `<option>${role.name}</option>`).join('');
        });
}

document.getElementById('deleteModalId').addEventListener('submit', (event) => {
    event.preventDefault();
    fetch(`http://localhost:8080/user/${document.getElementById('deleteId').value}/delete`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    }).then(() => {
        $('#deleteModal').modal('hide');
        getUsersTable();
    });
});

document.getElementById('newUserFormId').addEventListener('submit', (event) => {
    event.preventDefault();

    let newRoles = Array.from(document.getElementById('rolesNew').selectedOptions).map(option => ({
        id: parseInt(option.value)
    }));

    fetch('http://localhost:8080/user/create', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: document.getElementById('newName').value,
            firstName: document.getElementById('newFirstName').value,
            lastName: document.getElementById('newLastName').value,
            age: document.getElementById('newAge').value,
            email: document.getElementById('newEmail').value,
            password: document.getElementById('newPassword').value,
            roles: newRoles
        })
    }).then(() => {
        document.getElementById('usersTableTab').click();
        document.getElementById('newUserFormId').reset();
        getUsersTable();
    });
});
