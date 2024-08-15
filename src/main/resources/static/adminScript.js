async function getAdminInfo() {
    let temp = await fetch('http://localhost:8080/admin/auth')
    let user = await temp.json()
    let username = user.username
    let roles = user.roles
    getAdmin(user)
    getAdminNavBar({username, roles})

}

function getAdminNavBar({username, roles}) {
    let rolesNavBar = ''
    roles.forEach(role => {
        rolesNavBar += role.name.replace('ROLE_', '') + " "
    })
    document.getElementById('headerUsername').innerHTML = username
    document.getElementById('headerUserRoles').innerHTML = rolesNavBar
}

function getAdmin(user) {
    let roles = ''
    user.roles.forEach(role => {
        roles += role.name.replace('ROLE_', '') + " "
    })
    let temp = ''
    temp +=
        `<tr>
          <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.firstName}</td>
            <td>${user.lastName}</td>
            <td>${user.age}</td>
            <td>${user.email}</td>
            <td>${roles}</td>
         </tr>`
    document.getElementById('userInfoId').innerHTML = temp
}

void getAdminInfo()

//get users
function getUsersTable() {
    const userTable = fetch('http://localhost:8080/admin/table').then(response => response.json())
    userTable.then(users => {
        let res = ''
        for (let user of users) {
            let roles = ''
            user.roles.forEach(role => {
                roles += role.name.replace('ROLE_', '') + " "
            })
            res += `<tr>
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.firstName}</td>
            <td>${user.lastName}</td>
            <td>${user.age}</td>
            <td>${user.email}</td>
            <td>${roles}</td>
            <td>
                <button type="button" id="ed_btn" class="btn btn-info" data-toggle="modal"
                data-target="#editModal" 
                onclick="editModal(${user.id})">Edit</button>
            </td>
        
            <td>
                <button class="btn btn-danger" data-toggle="modal"
                data-target="#deleteModal" 
                onclick="deleteModal(${user.id})">Delete</button>
            </td>
        </tr>`
        }
        document.getElementById('tableUsers').innerHTML = res
    })
}

getUsersTable()

//patch user
function editModal(id) {

    fetch('http://localhost:8080/admin/' + id).then(res => {
        res.json().then(userEdit => {
            document.getElementById('editId').value = userEdit.id
            document.getElementById('editName').value = userEdit.username
            document.getElementById('editFirstName').value = userEdit.firstName
            document.getElementById('editLastName').value = userEdit.lastName
            document.getElementById('editAge').value = userEdit.age
            document.getElementById('editEmail').value = userEdit.email
        })
    })
}

document.getElementById('modalEditId').addEventListener('submit', (event) => {
    event.preventDefault()
    let roles = $("#rolesEdit").val()
    for (let i = 0; i < roles.length; i++) {
        if (roles[i] === '2') {
            roles[i] = {
                'id': 2,
                'name': 'ROLE_ADMIN',
                "authority": "ROLE_ADMIN"
            }
        }
        if (roles[i] === '1') {
            roles[i] = {
                'id': 1,
                'name': 'ROLE_USER',
                "authority": "ROLE_USER"
            }
        }
    }

    fetch('http://localhost:8080/admin/' + document.getElementById('editId').value + '/edit', {
        credentials: 'include',
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json"
        },
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
        $('#editModal').modal('hide')
        getUsersTable()
    })
})

//delete user
function deleteModal(id) {
    fetch('http://localhost:8080/admin/' + id).then(res => {
        res.json().then(userDelete => {
            document.getElementById('deleteId').value = userDelete.id
            document.getElementById('deleteName').value = userDelete.username
            document.getElementById('deleteFirstName').value = userDelete.firstName
            document.getElementById('deleteFirstName').value = userDelete.lastName
            document.getElementById('deleteAge').value = userDelete.age
            document.getElementById('deleteEmail').value = userDelete.email
            document.getElementById('rolesDelete').innerHTML = ''
            userDelete.roles.forEach(role => {
                const option = document.createElement('option')
                option.text = role.name
                document.getElementById('rolesDelete').add(option)
            })
        })
    })
}

document.getElementById('deleteModalId').addEventListener('submit', (event) => {
    event.preventDefault()
    fetch('http://localhost:8080/admin/' + document.getElementById('deleteId').value + '/delete', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },

    })
        .then(() => {
            $('#deleteModal').modal('hide')
            getUsersTable()
        })
})

// post user
const rolesNew = document.getElementById('rolesNew').selectedOptions
document.getElementById('newUserFormId').addEventListener('submit', (event) => {
    event.preventDefault()
    let newRoles = []
    for (let i = 0; i < rolesNew.length; i++) {
        newRoles.push({
            id: rolesNew[i].value
        })
    }

    fetch('http://localhost:8080/admin/create', {
        credentials: 'include',
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
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
        document.getElementById('usersTableTab').click()
        document.getElementById('newUserFormId').reset()
        getUsersTable()
    })
})