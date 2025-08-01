let display = document.getElementById('display');
let currentInput = '';
let operator = '';
let operand1 = '';
let operand2 = '';

function appendNumber(number) {
    if (currentInput.includes('.') && number === '.') return;
    currentInput += number;
    updateDisplay(currentInput);
}

function appendOperator(op) {
    if (currentInput === '') return;
    if (operand1 === '') {
        operand1 = currentInput;
        operator = op;
        currentInput = '';
    } else {
        operand2 = currentInput;
        calculateResult();
        operator = op;
    }
}

function calculateResult() {
    if (operand1 === '' || currentInput === '') return;
    operand2 = currentInput;
    let result = 0;
    const num1 = parseFloat(operand1);
    const num2 = parseFloat(operand2);

    switch (operator) {
        case '+':
            result = num1 + num2;
            break;
        case '-':
            result = num1 - num2;
            break;
        case '*':
            result = num1 * num2;
            break;
        case '/':
            if (num2 === 0) {
                alert("Cannot divide by zero");
                clearDisplay();
                return;
            }
            result = num1 / num2;
            break;
    }
    updateDisplay(result);
    operand1 = result;
    currentInput = '';
    operand2 = '';
    operator = '';
}

function clearDisplay() {
    currentInput = '';
    operand1 = '';
    operand2 = '';
    operator = '';
    updateDisplay('0');
}

function deleteLast() {
    currentInput = currentInput.slice(0, -1);
    updateDisplay(currentInput || '0');
}

function updateDisplay(value) {
    display.innerText = value;
}
