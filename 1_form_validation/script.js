const form = document.querySelector('#form');
const username = document.querySelector('#username');
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const password_2 = document.querySelector('#password2');


function checkRequired(inputArr) {
    inputArr.forEach(input => {
        if (input.value.trim() === '') {
            showError(input,
                `${getFieldName(input)} must not be empty`);
        }
    });
}

function getFieldName(input) {
    return input.id.charAt(0).toUpperCase() + input.id.slice(1);
}

function checkLength(input, min, max) {
    if (input.value.length < min) {
        showError(input,
            `${getFieldName(input)} must be at least ${min} characters`);
    } else if (input.value.length > max) {
        showError(input,
            `${getFieldName(input)} must be less than ${max} characters`);
    } else {
        showSuccess(input);
    }
}

function checkPasswordMatch(input1, input2) {
    if (input1.value !== input2.value || input1.value === ') {
        showError(input2, 'Passowords do not match');
    }
    else {
        showSuccess(input2);
    }
}

function showError(input, message) {
    const formContainer = input.parentElement;
    formContainer.className = "form-container error";
    const small = formContainer.querySelector('small');
    small.innerText = message;
}

function showSuccess(input) {
    const formContainer = input.parentElement;
    formContainer.className = "form-container success";
}

function checkEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(email.value.trim())) {
        showSuccess(email);
    } else {
        showError(email, 'Not a valid email.');
    }
}

form.addEventListener('submit', function(e) {
    e.preventDefault();
    debugger;
    checkRequired([username, email, password, password_2]);
    checkLength(username, 3, 15);
    checkLength(password, 6, 25);
    checkPasswordMatch(password, password_2);
    checkEmail(email);
});