document.addEventListener('DOMContentLoaded', () => {
    const display = document.querySelector('.display');
    let currentInput = '0';
    let operator = null;
    let firstOperand = null;
    let memory = 0;

    function updateDisplay() {
        display.textContent = currentInput;
    }

    function handleNumber(number) {
        if (currentInput === '0') {
            currentInput = number;
        } else {
            currentInput += number;
        }
        updateDisplay();
    }

    function handleOperator(op) {
        if (operator !== null && firstOperand !== null) {
            handleEquals();
        }
        operator = op;
        firstOperand = parseFloat(currentInput);
        currentInput = '0';
    }

    function handleEquals() {
        if (operator === null || firstOperand === null) {
            return;
        }
        const secondOperand = parseFloat(currentInput);
        let result;
        switch (operator) {
            case '+':
                result = firstOperand + secondOperand;
                break;
            case '-':
                result = firstOperand - secondOperand;
                break;
            case '×':
                result = firstOperand * secondOperand;
                break;
            case '÷':
                result = firstOperand / secondOperand;
                break;
        }
        currentInput = result.toString();
        operator = null;
        firstOperand = null;
        updateDisplay();
    }

    function handleClear() {
        currentInput = '0';
        operator = null;
        firstOperand = null;
        updateDisplay();
    }

    function handleClearEntry() {
        currentInput = '0';
        updateDisplay();
    }

    function handleDecimal() {
        if (!currentInput.includes('.')) {
            currentInput += '.';
            updateDisplay();
        }
    }

    function handlePercentage() {
        currentInput = (parseFloat(currentInput) / 100).toString();
        updateDisplay();
    }

    function handleSqrt() {
        currentInput = Math.sqrt(parseFloat(currentInput)).toString();
        updateDisplay();
    }

    function handleMemoryClear() {
        memory = 0;
    }

    function handleMemoryRecall() {
        currentInput = memory.toString();
        updateDisplay();
    }

    function handleMemoryAdd() {
        memory += parseFloat(currentInput);
    }

    function handleMemorySubtract() {
        memory -= parseFloat(currentInput);
    }

    document.querySelector('.buttons').addEventListener('click', (event) => {
        const target = event.target;
        if (!target.matches('button')) {
            return;
        }

        if (target.classList.contains('btn-0')) handleNumber('0');
        if (target.classList.contains('btn-1')) handleNumber('1');
        if (target.classList.contains('btn-2')) handleNumber('2');
        if (target.classList.contains('btn-3')) handleNumber('3');
        if (target.classList.contains('btn-4')) handleNumber('4');
        if (target.classList.contains('btn-5')) handleNumber('5');
        if (target.classList.contains('btn-6')) handleNumber('6');
        if (target.classList.contains('btn-7')) handleNumber('7');
        if (target.classList.contains('btn-8')) handleNumber('8');
        if (target.classList.contains('btn-9')) handleNumber('9');
        if (target.classList.contains('btn-00')) handleNumber('00');

        if (target.classList.contains('btn-add')) handleOperator('+');
        if (target.classList.contains('btn-subtract')) handleOperator('-');
        if (target.classList.contains('btn-multiply')) handleOperator('×');
        if (target.classList.contains('btn-divide')) handleOperator('÷');

        if (target.classList.contains('btn-equals')) handleEquals();
        if (target.classList.contains('btn-ac')) handleClear();
        if (target.classList.contains('btn-ce')) handleClearEntry();
        if (target.classList.contains('btn-dot')) handleDecimal();
        if (target.classList.contains('btn-percent')) handlePercentage();
        if (target.classList.contains('btn-sqrt')) handleSqrt();

        if (target.classList.contains('btn-mrc')) {
            // Simple MRC: first click recalls, second clears.
            if (currentInput === memory.toString()) {
                handleMemoryClear();
            } else {
                handleMemoryRecall();
            }
        }
        if (target.classList.contains('btn-m-plus')) handleMemoryAdd();
        if (target.classList.contains('btn-m-minus')) handleMemorySubtract();
    });
});
