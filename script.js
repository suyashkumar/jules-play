document.addEventListener('DOMContentLoaded', () => {
    const displayElement = document.querySelector('.display');
    const memoryIndicatorElement = document.querySelector('.memory-indicator');
    const buttons = document.querySelector('.calculator-buttons');

    let currentOperand = '0';
    let previousOperand = '';
    let operation = null;
    let memory = 0;
    let mrcPressedLast = false;
    let shouldResetScreen = false;
    let lastClickedButton = null;

    const updateDisplay = () => {
        displayElement.innerText = currentOperand.length > 16 ? parseFloat(currentOperand).toExponential(9) : currentOperand;
        memoryIndicatorElement.style.opacity = memory !== 0 ? '1' : '0';
    };

    const calculate = () => {
        let result;
        const prev = parseFloat(previousOperand);
        const current = parseFloat(currentOperand);
        if (isNaN(prev) || isNaN(current)) return;

        switch (operation) {
            case '+': result = prev + current; break;
            case '-': result = prev - current; break;
            case '×': result = prev * current; break;
            case '÷': result = prev / current; break;
            default: return;
        }
        currentOperand = String(result);
        operation = null;
        previousOperand = '';
    };

    const handleOperator = (button) => {
        const operator = button.innerText;
        if (button.classList.contains('equals')) {
            if (operation && previousOperand !== '') {
                calculate();
                shouldResetScreen = true;
            }
        } else if (button.classList.contains('sqrt')) {
            currentOperand = String(Math.sqrt(parseFloat(currentOperand)));
            shouldResetScreen = true;
        } else if (button.classList.contains('percent')) {
            currentOperand = String(parseFloat(currentOperand) / 100);
            shouldResetScreen = true;
        } else { // +, -, ×, ÷
            if (currentOperand === '' && previousOperand === '') return;
            if (operation && previousOperand !== '') {
                calculate();
            }
            operation = operator;
            previousOperand = currentOperand;
            shouldResetScreen = true;
        }
    };

    const handleFunction = (button) => {
        const func = button.innerText;
        switch (func) {
            case 'AC':
                currentOperand = '0';
                previousOperand = '';
                operation = null;
                if (lastClickedButton) {
                    lastClickedButton.classList.remove('clicked');
                    lastClickedButton = null;
                }
                break;
            case 'CE':
                currentOperand = '0';
                break;
            case '→':
                currentOperand = currentOperand.slice(0, -1) || '0';
                break;
            case 'M+':
                memory += parseFloat(currentOperand);
                shouldResetScreen = true;
                break;
            case 'M-':
                memory -= parseFloat(currentOperand);
                shouldResetScreen = true;
                break;
            case 'MRC':
                if (mrcPressedLast) {
                    memory = 0;
                    mrcPressedLast = false;
                } else {
                    currentOperand = String(memory);
                    shouldResetScreen = true;
                    mrcPressedLast = true;
                }
                break;
        }
    };

    buttons.addEventListener('click', (e) => {
        if (!e.target.matches('button')) return;

        const button = e.target;

        if (lastClickedButton) {
            lastClickedButton.classList.remove('clicked');
        }
        button.classList.add('clicked');
        lastClickedButton = button;

        const value = button.innerText;

        if (!button.classList.contains('mrc')) {
            mrcPressedLast = false;
        }

        if ((button.classList.contains('number') && !button.classList.contains('dot'))) {
             if (value === '00' && currentOperand === '0') {
                // do nothing
             } else if (shouldResetScreen || currentOperand === '0') {
                currentOperand = value;
                shouldResetScreen = false;
            } else {
                currentOperand += value;
            }
        } else if (button.classList.contains('dot')) {
            if (shouldResetScreen) {
                currentOperand = '0.';
                shouldResetScreen = false;
            } else if (!currentOperand.includes('.')) {
                currentOperand += '.';
            }
        } else if (button.classList.contains('operator')) {
            handleOperator(button);
        } else if (button.classList.contains('function')) {
            handleFunction(button);
        }

        updateDisplay();
    });

    updateDisplay();
});
