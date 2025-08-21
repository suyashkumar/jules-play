document.addEventListener('DOMContentLoaded', () => {
    const display = document.querySelector('.display-text');
    const buttons = document.querySelector('.buttons');

    let currentInput = '0';
    let operator = null;
    let firstOperand = null;
    let memory = 0;
    let mrcPressedOnce = false;

    buttons.addEventListener('click', (event) => {
        const target = event.target;
        if (!target.matches('button')) {
            return;
        }

        // Visual feedback for button click
        target.classList.add('clicked');
        setTimeout(() => {
            target.classList.remove('clicked');
        }, 200);

        const key = target.textContent;
        const action = target.classList;

        if (action.contains('number')) {
            handleNumber(key);
        } else if (action.contains('operator')) {
            handleOperator(key);
        } else if (action.contains('equals')) {
            handleEquals();
        } else if (action.contains('all-clear')) {
            resetCalculator();
        } else if (action.contains('clear')) {
            clearEntry();
        } else if (action.contains('arrow')) {
            backspace();
        } else if (key === 'M+') {
            memoryAdd();
        } else if (key === 'M-') {
            memorySubtract();
        } else if (key === 'MRC') {
            memoryRecallClear();
        }

        updateDisplay();
    });

    function updateDisplay() {
        display.textContent = currentInput;
    }

    function handleNumber(num) {
        if (currentInput === '0' || currentInput === '-0') {
            currentInput = num;
        } else {
            currentInput += num;
        }
        mrcPressedOnce = false;
    }

    function handleOperator(op) {
        if (operator && firstOperand) {
            handleEquals();
        }

        if (op === '√') {
            currentInput = Math.sqrt(parseFloat(currentInput)).toString();
            return;
        }

        if (op === '%') {
            currentInput = (parseFloat(currentInput) / 100).toString();
            return;
        }

        firstOperand = currentInput;
        operator = op;
        currentInput = '0';
        mrcPressedOnce = false;
    }

    function handleEquals() {
        if (!operator || firstOperand === null) {
            return;
        }

        const secondOperand = currentInput;
        currentInput = calculate(firstOperand, operator, secondOperand).toString();
        operator = null;
        firstOperand = null;
        mrcPressedOnce = false;
    }

    function calculate(a, op, b) {
        const numA = parseFloat(a);
        const numB = parseFloat(b);
        switch (op) {
            case '+': return numA + numB;
            case '-': return numA - numB;
            case '×': return numA * numB;
            case '÷': return numA / numB;
            default: return numB;
        }
    }

    function resetCalculator() {
        currentInput = '0';
        operator = null;
        firstOperand = null;
        mrcPressedOnce = false;
    }

    function clearEntry() {
        currentInput = '0';
        mrcPressedOnce = false;
    }

    function backspace() {
        currentInput = currentInput.slice(0, -1);
        if (currentInput === '') {
            currentInput = '0';
        }
        mrcPressedOnce = false;
    }

    function memoryAdd() {
        memory += parseFloat(currentInput);
        mrcPressedOnce = false;
    }

    function memorySubtract() {
        memory -= parseFloat(currentInput);
        mrcPressedOnce = false;
    }

    function memoryRecallClear() {
        if (mrcPressedOnce) {
            memory = 0;
            mrcPressedOnce = false;
        } else {
            currentInput = memory.toString();
            mrcPressedOnce = true;
        }
    }
});
