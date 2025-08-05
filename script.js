document.addEventListener('DOMContentLoaded', () => {
    const display = document.querySelector('.display-text');
    const buttons = document.querySelectorAll('button');

    let currentInput = '';
    let operator = '';
    let previousInput = '';
    let memory = 0;

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const buttonText = button.textContent;

            if (isNumber(buttonText) || buttonText === '.') {
                handleNumber(buttonText);
            } else if (isOperator(buttonText)) {
                handleOperator(buttonText);
            } else {
                handleSpecial(buttonText);
            }
        });
    });

    function isNumber(str) {
        return /^\d+$/.test(str) || str === '00';
    }

    function isOperator(str) {
        return ['+', '-', '×', '÷', '√', '%'].includes(str);
    }

    function handleNumber(num) {
        if (num === '.' && currentInput.includes('.')) return;
        currentInput += num;
        updateDisplay();
    }

    function handleOperator(op) {
        if (currentInput === '' && op !== '√') return;

        if (op === '√') {
            currentInput = Math.sqrt(parseFloat(currentInput)).toString();
            updateDisplay();
            return;
        }

        if (op === '%') {
            currentInput = (parseFloat(currentInput) / 100).toString();
            updateDisplay();
            return;
        }

        if (previousInput !== '') {
            calculate();
        }
        operator = op;
        previousInput = currentInput;
        currentInput = '';
    }

    function handleSpecial(special) {
        switch (special) {
            case 'AC':
                currentInput = '';
                previousInput = '';
                operator = '';
                updateDisplay('0');
                break;
            case 'CE':
                currentInput = '';
                updateDisplay('0');
                break;
            case '=':
                calculate();
                break;
            case 'M+':
                memory += parseFloat(currentInput || previousInput);
                break;
            case 'M-':
                memory -= parseFloat(currentInput || previousInput);
                break;
            case 'MRC':
                currentInput = memory.toString();
                updateDisplay();
                break;
            case '→':
                currentInput = currentInput.slice(0, -1);
                updateDisplay();
                break;
        }
    }

    function calculate() {
        if (previousInput === '' || currentInput === '') return;
        let result;
        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);

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
                if (current === 0) {
                    updateDisplay('Error');
                    return;
                }
                result = prev / current;
                break;
        }
        currentInput = result.toString();
        operator = '';
        previousInput = '';
        updateDisplay();
    }

    function updateDisplay(value) {
        display.textContent = value !== undefined ? value : (currentInput || previousInput || '0');
    }
});
