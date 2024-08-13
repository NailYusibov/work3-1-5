
async function getUserInfo() {
    let temp = await fetch('http://localhost:8053/user/auth')
    let user = await temp.json()
    let roles = user.roles
    getUser(user)
    getNavBar({user, roles})

}
function getNavBar({username, roles}) {
    let rolesNavBar = ''
    roles.forEach(role => {
        rolesNavBar += role.firstName.replace('ROLE_', '') + " "
    })
    document.getElementById('headerUsername').innerHTML = username
    document.getElementById('headerUserRoles').innerHTML = rolesNavBar
}
function getUser(user) {
    if (user.roles) {
        let rolesUser =''
        user.roles.forEach(role => {
            rolesUser += role.firstName.replace('ROLE_', '') + " "
        })
        let temp = ''
        temp +=
            `<tr>
          <td>${user.id}</td>
            <td>${user.firstName}</td>
            <td>${user.lastName}</td>
            <td>${user.age}</td>
            <td>${user.email}</td>
            <td>${rolesUser}</td>
         </tr>`
        document.getElementById('userInfoId').innerHTML = temp
    }
}
void getUserInfo()
