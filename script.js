document.addEventListener('DOMContentLoaded', () => {
    const displayElement = document.getElementById('display');
    const memoryIndicator = document.getElementById('memory-indicator');

    let currentValue = '0';
    let previousValue = null;
    let operator = null;
    let waitingForSecondOperand = false;
    let memory = 0;

    const updateDisplay = () => {
        // Limit display length to fit screen roughly (e.g., 10-12 digits)
        let displayStr = currentValue.toString();
        if (displayStr.length > 12) {
            displayStr = displayStr.substring(0, 12);
        }
        displayElement.textContent = displayStr;
    };

    const inputDigit = (digit) => {
        if (waitingForSecondOperand) {
            currentValue = digit;
            waitingForSecondOperand = false;
        } else {
            currentValue = currentValue === '0' ? digit : currentValue + digit;
        }
    };

    const inputDecimal = () => {
        if (waitingForSecondOperand) {
            currentValue = '0.';
            waitingForSecondOperand = false;
            return;
        }

        if (!currentValue.includes('.')) {
            currentValue += '.';
        }
    };

    const handleOperator = (nextOperator) => {
        const inputValue = parseFloat(currentValue);

        if (operator && waitingForSecondOperand) {
            operator = nextOperator;
            return;
        }

        if (previousValue === null) {
            previousValue = inputValue;
        } else if (operator) {
            const result = performCalculation(operator, previousValue, inputValue);
            currentValue = String(result);
            previousValue = result;
        }

        waitingForSecondOperand = true;
        operator = nextOperator;
    };

    const performCalculation = (op, first, second) => {
        if (op === 'add') return first + second;
        if (op === 'subtract') return first - second;
        if (op === 'multiply') return first * second;
        if (op === 'divide') return second === 0 ? 'Error' : first / second;
        return second;
    };

    const resetCalculator = () => {
        currentValue = '0';
        previousValue = null;
        operator = null;
        waitingForSecondOperand = false;
    };

    const clearEntry = () => {
        currentValue = '0';
    };

    const backspace = () => {
        if (currentValue.length > 1) {
            currentValue = currentValue.slice(0, -1);
        } else {
            currentValue = '0';
        }
    };

    const handleMemory = (action) => {
        const val = parseFloat(currentValue);
        if (action === 'm-plus') {
            memory += val;
        } else if (action === 'm-minus') {
            memory -= val;
        } else if (action === 'mrc') {
            // If pressed once, recall. Logic could be complex (recall then clear),
            // but for simplicity let's make it recall.
            currentValue = String(memory);
            waitingForSecondOperand = true; // Treating recall like a result
        }

        if (memory !== 0) {
            memoryIndicator.classList.add('visible');
        } else {
            memoryIndicator.classList.remove('visible');
        }
    };

    const handlePercentage = () => {
        const val = parseFloat(currentValue);
        currentValue = String(val / 100);
    };

    const handleSqrt = () => {
        const val = parseFloat(currentValue);
        if (val < 0) {
            currentValue = 'Error';
        } else {
            currentValue = String(Math.sqrt(val));
        }
        waitingForSecondOperand = true;
    };

    document.querySelector('.buttons-grid').addEventListener('click', (event) => {
        const { target } = event;
        if (!target.matches('button')) return;

        if (target.dataset.num !== undefined) {
            inputDigit(target.dataset.num);
            updateDisplay();
            return;
        }

        const action = target.dataset.action;

        if (action === 'decimal') {
            inputDecimal();
        } else if (action === 'ac') {
            resetCalculator();
        } else if (action === 'ce') {
            clearEntry();
        } else if (action === 'backspace') {
            backspace();
        } else if (action === 'equals') {
            if (operator && previousValue !== null) {
                const inputValue = parseFloat(currentValue);
                const result = performCalculation(operator, previousValue, inputValue);
                currentValue = String(result);
                previousValue = null;
                operator = null;
                waitingForSecondOperand = true;
            }
        } else if (action === 'percent') {
            handlePercentage();
        } else if (action === 'sqrt') {
            handleSqrt();
        } else if (['m-plus', 'm-minus', 'mrc'].includes(action)) {
            handleMemory(action);
        } else {
            // Operators +, -, *, /
            handleOperator(action);
        }

        updateDisplay();
    });
});
