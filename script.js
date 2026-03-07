const display = document.getElementById('display');

function appendNumber(number) {
    if (display.innerText === 'Error') {
        display.innerText = '0';
    }

    if (display.innerText === '0' && number !== '.') {
        display.innerText = number;
    } else {
        // Prevent multiple decimals in the current operand
        const operands = display.innerText.split(/[\+\-\*\/]/);
        const currentOperand = operands[operands.length - 1];
        if (number === '.' && currentOperand.includes('.')) return;

        display.innerText += number;
    }
}

function appendOperator(operator) {
    if (display.innerText === 'Error') {
        display.innerText = '0';
    }

    const lastChar = display.innerText.slice(-1);
    // Don't append operator if the last character is already an operator
    if (['+', '-', '*', '/'].includes(lastChar)) {
        display.innerText = display.innerText.slice(0, -1) + operator;
        return;
    }
    display.innerText += operator;
}

function clearDisplay() {
    display.innerText = '0';
}

function deleteLast() {
    if (display.innerText === 'Error') {
        display.innerText = '0';
        return;
    }

    if (display.innerText.length === 1) {
        display.innerText = '0';
    } else {
        display.innerText = display.innerText.slice(0, -1);
    }
}

function calculate() {
    if (display.innerText === 'Error') return;

    try {
        let expression = display.innerText;

        // Remove trailing operators
        const lastChar = expression.slice(-1);
        if (['+', '-', '*', '/'].includes(lastChar)) {
            expression = expression.slice(0, -1);
        }

        // Using eval is generally not recommended for security reasons,
        // but for a simple calculator web app without user text input, it's acceptable.
        let result = eval(expression);

        // Handle division by zero
        if (!isFinite(result)) {
            display.innerText = 'Error';
            return;
        }

        // Limit decimal places to avoid overflowing the display
        if (result % 1 !== 0) {
            result = parseFloat(result.toFixed(8));
        }

        display.innerText = result;
    } catch (error) {
        display.innerText = 'Error';
    }
}
