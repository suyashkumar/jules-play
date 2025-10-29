const screen = document.querySelector('.screen');
const buttons = document.querySelectorAll('.btn');

let currentInput = '0';
let previousInput = '';
let operator = null;
let memory = 0;

const updateScreen = () => {
    screen.textContent = currentInput;
};

const handleNumber = (number) => {
    if (currentInput === '0') {
        currentInput = number;
    } else {
        currentInput += number;
    }
};

const handleOperator = (op) => {
    if (operator !== null) {
        calculate();
    }
    previousInput = currentInput;
    currentInput = '0';
    operator = op;
};

const calculate = () => {
    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);

    if (isNaN(prev) || isNaN(current)) return;

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
        default:
            return;
    }
    currentInput = result.toString();
    operator = null;
    previousInput = '';
};

const handleFunction = (func) => {
    switch (func) {
        case 'AC':
            currentInput = '0';
            previousInput = '';
            operator = null;
            break;
        case 'CE':
            currentInput = '0';
            break;
        case '√':
            currentInput = Math.sqrt(parseFloat(currentInput)).toString();
            break;
        case '%':
            currentInput = (parseFloat(currentInput) / 100).toString();
            break;
        case '→':
            currentInput = currentInput.slice(0, -1) || '0';
            break;
        case 'M+':
            memory += parseFloat(currentInput);
            break;
        case 'M-':
            memory -= parseFloat(currentInput);
            break;
        case 'MRC':
            currentInput = memory.toString();
            break;
    }
};

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.textContent;

        if (button.classList.contains('number')) {
            handleNumber(value);
        } else if (button.classList.contains('operator')) {
            handleOperator(value);
        } else if (button.classList.contains('equal')) {
            calculate();
        } else if (button.classList.contains('decimal')) {
            if (!currentInput.includes('.')) {
                currentInput += '.';
            }
        } else {
            handleFunction(value);
        }
        updateScreen();
    });
});
