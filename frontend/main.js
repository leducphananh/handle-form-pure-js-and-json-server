const tableElement = document.querySelector('.table');
const tbodyElement = tableElement.querySelector('tbody');
const formElement = document.querySelector('#form');
const submitButtonElement = document.querySelector('button[type="submit"]');
const updateButtonElement = document.getElementById('btn-update');

const userAPI = 'http://localhost:3000/users';

class User {
    constructor(name, gender, dob, phone, email, address, description, courses) {
        this.name = name;
        this.gender = gender;
        this.dob = dob;
        this.phone = phone;
        this.email = email;
        this.address = address;
        this.description = description;
        this.courses = courses;
    }
}

function main() {
    getUsers();
}

main();

function getUsers() {
    fetch(userAPI)
        .then(response => response.json())
        .then((users) => {
            render(users);
        })
}

function createUser(user) {
    fetch(userAPI, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user),
    })
        .then(response => response.json())
        .then(getUsers)
}

function handleDeleteUser(id) {
    fetch(userAPI + '/' + id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => response.json())
        .then(getUsers)
}

function handleGetUserById(id) {
    // Modify button
    submitButtonElement.classList.add('btn-inactive');
    submitButtonElement.classList.remove('btn-active');
    updateButtonElement.classList.add('btn-active');
    updateButtonElement.classList.remove('btn-inactive');

    fetch(userAPI + '/' + id, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => response.json())
        .then(showUser)
}

function updateUser(user) {
    fetch(userAPI + '/' + user.id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user),
    })
        .then(response => response.json())
        .then(getUsers)
}

function render(users) {
    let usersHTML = users.reduce((output, user) => {
        return output +
            `<tr>
                <td>${user.name}</td>
                <td>${user.gender}</td>
                <td>${user.dob}</td>
                <td>${user.phone}</td>
                <td>${user.email}</td>
                <td>${user.address}</td>
                <td>${user.description}</td>
                <td>${user.courses}</td>
                <td>
                    <button class="btn-control" onclick="handleGetUserById(${user.id})">Edit</button>
                    &nbsp;&nbsp;
                    <button class="btn-control" onclick="handleDeleteUser(${user.id})">Delete</button>
                </td>
            </tr>`
    }, '');

    tbodyElement.innerHTML = usersHTML;
}

function submitForm() {
    // Get value from form
    let name = document.getElementById('name').value;
    let gender = document.querySelector('input[name="gender"]:checked').value;
    let dob = document.getElementById('dob').value;
    let phone = document.getElementById('phone').value;
    let email = document.getElementById('email').value;
    let address = document.getElementById('address').value;
    let description = document.getElementById('description').value;
    let checkedValue = '';
    let inputCheckboxElements = document.querySelectorAll('input[name="level"]');
    for (let i = 0; i < inputCheckboxElements.length; i++) {
        if (inputCheckboxElements[i].checked) {
            checkedValue += inputCheckboxElements[i].value + ', ';
        }
    }
    checkedValue = checkedValue.slice(0, checkedValue.length - 2);

    // Init new user
    let user = new User(name, gender, dob, phone, email, address, description, checkedValue);

    // Call API 
    createUser(user);
}

function showUser(user) {
    document.getElementById('id').value = user.id;
    document.getElementById('name').value = user.name;
    if (user.gender === 'Male') {
        document.querySelector('input[id="male"]').checked = true;
    } else {
        document.querySelector('input[id="female"]').checked = true;
    }
    document.getElementById('dob').value = user.dob;
    document.getElementById('phone').value = user.phone;
    document.getElementById('email').value = user.email;
    document.getElementById('address').value = user.address;
    document.getElementById('description').value = user.description;
    let inputCheckboxElements = document.querySelectorAll('input[name="level"]');
    let checkedValue = user.courses.split(', ');
    for (let i = 0; i < inputCheckboxElements.length; i++) {
        if (checkedValue.includes(inputCheckboxElements[i].value)) {
            inputCheckboxElements[i].checked = true;
        } else {
            inputCheckboxElements[i].checked = false;
        }
    }
}

updateButtonElement.onclick = (e) => {
    e.preventDefault();

    // Get value from form
    let id = document.getElementById('id').value;
    let name = document.getElementById('name').value;
    let gender = document.querySelector('input[name="gender"]:checked').value;
    let dob = document.getElementById('dob').value;
    let phone = document.getElementById('phone').value;
    let email = document.getElementById('email').value;
    let address = document.getElementById('address').value;
    let description = document.getElementById('description').value;
    let checkedValue = '';
    let inputCheckboxElements = document.querySelectorAll('input[name="level"]');
    for (let i = 0; i < inputCheckboxElements.length; i++) {
        if (inputCheckboxElements[i].checked) {
            checkedValue += inputCheckboxElements[i].value + ', ';
        }
    }
    checkedValue = checkedValue.slice(0, checkedValue.length - 2);

    let user = new User(name, gender, dob, phone, email, address, description, checkedValue);
    user.id = id;

    // Call API 
    updateUser(user);

    submitButtonElement.classList.add('btn-active');
    submitButtonElement.classList.remove('btn-inactive');
    updateButtonElement.classList.add('btn-inactive');
    updateButtonElement.classList.remove('btn-active');

    // Reset form
    formElement.reset();
}
