const display = document.querySelector('.result');
const buttons = document.querySelector('.buttons');

let currentInput = '0';
let operator = null;
let previousInput = null;
let waitingForSecondOperand = false;

function updateDisplay() {
    display.textContent = currentInput;
}

buttons.addEventListener('click', (event) => {
    const { target } = event;
    const { textContent } = target;

    if (!target.matches('button')) {
        return;
    }

    switch (textContent) {
        case 'AC':
            currentInput = '0';
            operator = null;
            previousInput = null;
            waitingForSecondOperand = false;
            break;
        case '±':
            currentInput = (parseFloat(currentInput) * -1).toString();
            break;
        case '%':
            currentInput = (parseFloat(currentInput) / 100).toString();
            break;
        case '.':
            if (!currentInput.includes('.')) {
                currentInput += '.';
            }
            break;
        case '+':
        case '-':
        case '×':
        case '÷':
            if (operator && !waitingForSecondOperand) {
                calculate();
            }
            operator = textContent;
            previousInput = currentInput;
            waitingForSecondOperand = true;
            currentInput = '0';
            break;
        case '=':
            if (operator) {
                calculate();
                operator = null;
                waitingForSecondOperand = false;
            }
            break;
        default:
            if (waitingForSecondOperand) {
                currentInput = textContent;
                waitingForSecondOperand = false;
            } else {
                currentInput = currentInput === '0' ? textContent : currentInput + textContent;
            }
    }

    updateDisplay();
});

function calculate() {
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    let result = 0;

    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '×':
            result = prev * current;
            break;
        case '÷':
            result = prev / current;
            break;
    }

    currentInput = result.toString();
}

updateDisplay();
