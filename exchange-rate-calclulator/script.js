const currencyEl_one = document.querySelector('#currency-one');
const amountEl_one = document.querySelector('#amount-one');
const currencyEl_two = document.querySelector('#currency-two');
const amountEl_two = document.querySelector('#amount-two');

const rateEl = document.querySelector('#rate');
const swapBtn = document.querySelector('#swapBtn');
const dateDisplay = document.querySelector('#date');

calculateRate();

function displayDate() {
    const date = new Date();
    dateDisplay.innerText = date.getDay + date.getMonth + date.getFullYear;
}

function calculateRate() {
    const currency_one = currencyEl_one.value;
    const currency_two = currencyEl_two.value;

    fetch(`https://api.exchangerate-api.com/v4/latest/${currency_one}`)
        .then(response => response.json())
        .then(data => {

            const rate = data.rates[currency_two];
            rateEl.innerText = `1 ${currency_one} = ${rate} ${currency_two}`;

            amountEl_two.value = (amountEl_one.value * rate).toFixed(2);

        })
        .catch(err => {
            const errName = err.name;
            const errMsg = err.message;
            alert(`${errName}: ${errMsg}`);
        });

}

function swapCurrencies() {
    // const temp = currencyEl_one.value;
    // currencyEl_one.value = currencyEl_two.value;
    // currencyEl_two.value = temp;
    [currencyEl_one.value, currencyEl_two.value] = [currencyEl_two.value, currencyEl_one.value];

    calculateRate();
}

currencyEl_one.addEventListener('change', calculateRate);
amountEl_one.addEventListener('input', calculateRate);
currencyEl_two.addEventListener('change', calculateRate);
amountEl_two.addEventListener('input', calculateRate);

swapBtn.addEventListener('click', swapCurrencies);