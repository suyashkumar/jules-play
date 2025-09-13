document.addEventListener('DOMContentLoaded', () => {
    const screen = document.getElementById('screen');
    const buttons = document.querySelectorAll('.buttons button');
    let currentInput = '0';
    let operator = null;
    let previousInput = null;
    let memory = 0;
    let mrcPressedOnce = false;

    function updateScreen() {
        screen.value = currentInput;
    }

    function handleNumber(number) {
        if (currentInput === '0' && number !== '.') {
            currentInput = number;
        } else if (number === '.' && currentInput.includes('.')) {
            return;
        } else {
            currentInput += number;
        }
        mrcPressedOnce = false;
    }

    function handleOperator(op) {
        if (previousInput === null) {
            previousInput = currentInput;
            operator = op;
            currentInput = '0';
        } else {
            calculate();
            operator = op;
        }
        mrcPressedOnce = false;
    }

    function calculate() {
        if (operator === null || previousInput === null) {
            return;
        }

        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);
        let result;

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
                    alert('Cannot divide by zero');
                    return;
                }
                result = prev / current;
                break;
            default:
                return;
        }

        currentInput = result.toString();
        operator = null;
        previousInput = null;
        updateScreen();
    }

    function handleSpecial(command) {
        switch (command) {
            case 'AC':
                currentInput = '0';
                operator = null;
                previousInput = null;
                mrcPressedOnce = false;
                break;
            case 'CE':
                currentInput = '0';
                mrcPressedOnce = false;
                break;
            case '√':
                currentInput = Math.sqrt(parseFloat(currentInput)).toString();
                break;
            case '%':
                if (previousInput) {
                    currentInput = (parseFloat(previousInput) * (parseFloat(currentInput) / 100)).toString();
                } else {
                    currentInput = (parseFloat(currentInput) / 100).toString();
                }
                break;
            case '→':
                currentInput = currentInput.slice(0, -1) || '0';
                break;
            case 'M+':
                memory += parseFloat(currentInput);
                mrcPressedOnce = false;
                break;
            case 'M-':
                memory -= parseFloat(currentInput);
                mrcPressedOnce = false;
                break;
            case 'MRC':
                if (mrcPressedOnce) {
                    memory = 0;
                    mrcPressedOnce = false;
                } else {
                    currentInput = memory.toString();
                    mrcPressedOnce = true;
                }
                break;
        }
        updateScreen();
    }

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.textContent;

            if (button.classList.contains('btn-number')) {
                handleNumber(value);
                updateScreen();
            } else if (button.classList.contains('btn-operator')) {
                handleOperator(value);
            } else if (button.classList.contains('btn-equal')) {
                calculate();
            } else if (button.classList.contains('btn-special')) {
                handleSpecial(value);
            }
        });
    });

    updateScreen();
});
