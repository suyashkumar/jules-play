const calculator = document.querySelector('.calculator');
const keys = calculator.querySelector('.keys');
const display = document.getElementById('display');
let firstValue = '';
let operator = '';
let secondValue = '';
let shouldResetDisplay = false;

keys.addEventListener('click', e => {
    if (e.target.matches('button')) {
        const key = e.target;
        const action = key.dataset.action;
        const keyContent = key.textContent;
        const displayedNum = display.textContent;

        if (!action) {
            if (displayedNum === '0' || shouldResetDisplay) {
                display.textContent = keyContent;
                shouldResetDisplay = false;
            } else {
                display.textContent = displayedNum + keyContent;
            }
        }

        if (action === 'add' || action === 'subtract' || action === 'multiply' || action === 'divide') {
            firstValue = displayedNum;
            operator = action;
            shouldResetDisplay = true;
        }

        if (action === 'decimal') {
            if (!displayedNum.includes('.')) {
                display.textContent = displayedNum + '.';
            }
        }

        if (action === 'clear') {
            display.textContent = '0';
            firstValue = '';
            operator = '';
            secondValue = '';
        }

        if (action === 'calculate') {
            secondValue = displayedNum;
            const result = calculate(firstValue, operator, secondValue);
            display.textContent = result;
            firstValue = result;
            shouldResetDisplay = true;
        }
    }
});

function calculate(first, operator, second) {
    const firstNum = parseFloat(first);
    const secondNum = parseFloat(second);
    if (operator === 'add') return firstNum + secondNum;
    if (operator === 'subtract') return firstNum - secondNum;
    if (operator === 'multiply') return firstNum * secondNum;
    if (operator === 'divide') return firstNum / secondNum;
}
