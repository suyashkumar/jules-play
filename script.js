document.addEventListener('DOMContentLoaded', () => {
    const display = document.querySelector('.display-text');
    const memoryIndicator = document.querySelector('.memory-indicator');
    const buttons = document.querySelector('.buttons');

    let currentOperand = '0';
    let previousOperand = '';
    let operator = null;
    let shouldResetScreen = false;
    let memory = 0;
    let mrcClicked = false;

    buttons.addEventListener('click', (event) => {
        const { target } = event;
        if (!target.matches('button')) {
            return;
        }

        const { number } = target.dataset;
        const { operator: op } = target.dataset;
        const { action } = target.dataset;

        if (number) {
            appendNumber(number);
        } else if (op) {
            chooseOperator(op);
        } else if (action) {
            performAction(action);
        }

        updateDisplay();
    });

    function appendNumber(number) {
        if (currentOperand === 'Error') {
            resetCalculator();
        }

        if (shouldResetScreen) {
            currentOperand = '0';
            shouldResetScreen = false;
        }

        if (currentOperand === '0' && (number === '0' || number === '00')) {
            return;
        }

        if (currentOperand === '0' && number !== '.') {
            currentOperand = number;
        } else {
            currentOperand += number;
        }

        if (currentOperand.length > 14) {
            currentOperand = currentOperand.slice(0, 14);
        }
        mrcClicked = false;
    }

    function chooseOperator(op) {
        if (currentOperand === 'Error') return;

        if (operator && !shouldResetScreen) {
            calculate();
        }

        // After a calculation, if user hits an operator, they want to continue the chain
        if (currentOperand !== 'Error') {
            operator = op;
            previousOperand = currentOperand;
            shouldResetScreen = true;
        }

        mrcClicked = false;
    }

    function calculate() {
        let result;
        const prev = parseFloat(previousOperand);
        const current = parseFloat(currentOperand);

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
                if (current === 0) {
                    result = 'Error';
                } else {
                    result = prev / current;
                }
                break;
            default:
                return;
        }
        currentOperand = formatResult(result);
        operator = null;
        previousOperand = '';
    }

    function performAction(action) {
        if (currentOperand === 'Error' && action !== 'all-clear') {
             resetCalculator();
             return;
        }

        switch (action) {
            case 'all-clear':
                resetCalculator();
                memory = 0; // AC clears everything including memory
                updateMemoryIndicator();
                break;
            case 'clear-entry':
                currentOperand = '0';
                break;
            case 'backspace':
                currentOperand = currentOperand.slice(0, -1) || '0';
                break;
            case 'decimal':
                if (!currentOperand.includes('.')) {
                    currentOperand += '.';
                }
                break;
            case 'equals':
                if (operator) {
                    calculate();
                    shouldResetScreen = true;
                }
                break;
            case 'sqrt':
                currentOperand = formatResult(Math.sqrt(parseFloat(currentOperand)));
                shouldResetScreen = true;
                break;
            case 'percent':
                // Percentage logic depends on context, but a simple version is dividing by 100
                currentOperand = formatResult(parseFloat(currentOperand) / 100);
                shouldResetScreen = true;
                break;
            case 'm-plus':
                memory += parseFloat(currentOperand);
                updateMemoryIndicator();
                shouldResetScreen = true;
                mrcClicked = false;
                break;
            case 'm-minus':
                memory -= parseFloat(currentOperand);
                updateMemoryIndicator();
                shouldResetScreen = true;
                mrcClicked = false;
                break;
            case 'mrc':
                if (mrcClicked) {
                    memory = 0;
                    updateMemoryIndicator();
                } else {
                    currentOperand = memory.toString();
                    shouldResetScreen = true;
                }
                mrcClicked = !mrcClicked;
                break;
        }
    }

    function resetCalculator() {
        currentOperand = '0';
        previousOperand = '';
        operator = null;
        shouldResetScreen = false;
        mrcClicked = false;
    }

    function formatResult(number) {
        if (number === 'Error') return 'Error';
        let numStr = number.toString();
        if (numStr.length > 14) {
            return Number(number).toPrecision(9);
        }
        return numStr;
    }

    function updateDisplay() {
        display.textContent = currentOperand;
    }

    function updateMemoryIndicator() {
        memoryIndicator.style.visibility = memory !== 0 ? 'visible' : 'hidden';
        if (memory !== 0) {
            memoryIndicator.textContent = 'M';
        }
    }

    resetCalculator();
    updateDisplay();
});
