document.addEventListener('DOMContentLoaded', () => {
    const screen = document.getElementById('screen');
    const keys = document.querySelectorAll('.key');
    let currentInput = '0';
    let previousInput = '';
    let operator = null;
    let newNumber = true;

    keys.forEach(key => {
        key.addEventListener('click', () => {
            const action = key.dataset.action;
            const num = key.dataset.num;

            // Visual feedback for click
            handleButtonPress(key);

            if (num !== undefined) {
                appendNumber(num);
            } else if (action === 'decimal') {
                appendDecimal();
            } else if (action === 'clear') {
                clear();
            } else if (action === 'delete') {
                deleteLast();
            } else if (action === 'calculate') {
                calculate();
            } else {
                setOperator(action);
            }
            updateScreen();
        });
    });

    function appendNumber(number) {
        if (newNumber) {
            currentInput = number;
            newNumber = false;
        } else {
            if (currentInput === '0') {
                currentInput = number;
            } else {
                currentInput += number;
            }
        }
    }

    function appendDecimal() {
        if (newNumber) {
            currentInput = '0.';
            newNumber = false;
        } else if (!currentInput.includes('.')) {
            currentInput += '.';
        }
    }

    function clear() {
        currentInput = '0';
        previousInput = '';
        operator = null;
        newNumber = true;
    }

    function deleteLast() {
        if (newNumber) return;
        currentInput = currentInput.slice(0, -1);
        if (currentInput === '' || currentInput === '-') {
            currentInput = '0';
            newNumber = true;
        }
    }

    function setOperator(op) {
        if (operator !== null && !newNumber) {
            calculate();
        }
        previousInput = currentInput;
        operator = op;
        newNumber = true;
    }

    function calculate() {
        if (operator === null || newNumber) return;
        let result;
        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);

        if (isNaN(prev) || isNaN(current)) return;

        switch (operator) {
            case 'add':
                result = prev + current;
                break;
            case 'subtract':
                result = prev - current;
                break;
            case 'multiply':
                result = prev * current;
                break;
            case 'divide':
                result = prev / current;
                break;
            default:
                return;
        }

        currentInput = result.toString();
        operator = null;
        newNumber = true;
    }

    function updateScreen() {
        screen.value = currentInput;
    }

    function handleButtonPress(button) {
        // Add 'pressed' class
        button.classList.add('pressed');
        // Remove it after a short delay to simulate "residual effect"
        setTimeout(() => {
            button.classList.remove('pressed');
        }, 200); // 200ms delay for visibility in video
    }
});
