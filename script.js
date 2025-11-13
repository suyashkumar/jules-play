document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display');
    let currentInput = '0';
    let previousInput = null;
    let operator = null;
    let memory = 0;
    let resetDisplay = false;

    const updateDisplay = () => {
        // Limit display length to prevent overflow (simple truncation)
        let displayValue = currentInput;
        if (displayValue.length > 12) {
            displayValue = displayValue.substring(0, 12);
        }
        display.textContent = displayValue;
    };

    const handleNumber = (num) => {
        if (resetDisplay) {
            currentInput = num;
            resetDisplay = false;
        } else {
            if (currentInput === '0') {
                currentInput = num;
            } else {
                currentInput += num;
            }
        }
        updateDisplay();
    };

    const handleDoubleZero = () => {
        if (resetDisplay) {
            currentInput = '0';
            resetDisplay = false;
        } else {
            if (currentInput !== '0') {
                currentInput += '00';
            }
        }
        updateDisplay();
    };

    const handleDecimal = () => {
        if (resetDisplay) {
            currentInput = '0.';
            resetDisplay = false;
        } else if (!currentInput.includes('.')) {
            currentInput += '.';
        }
        updateDisplay();
    };

    const handleOperator = (op) => {
        if (operator !== null && !resetDisplay) {
            calculate();
        }
        previousInput = currentInput;
        operator = op;
        resetDisplay = true;
    };

    const calculate = () => {
        if (operator === null || previousInput === null) return;

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
            case '*':
                result = prev * current;
                break;
            case '/':
                if (current === 0) {
                    result = 'Error';
                } else {
                    result = prev / current;
                }
                break;
        }

        // Reset for next operation
        if (result === 'Error') {
            currentInput = 'Error';
            previousInput = null;
            operator = null;
        } else {
            // Round to avoid floating point issues and fit screen
            result = Math.round(result * 10000000000) / 10000000000;
            currentInput = result.toString();
            previousInput = null;
            operator = null;
        }

        resetDisplay = true; // Result is shown, next number input should start fresh
        updateDisplay();
    };

    const handleClearEntry = () => {
        currentInput = '0';
        updateDisplay();
    };

    const handleAllClear = () => {
        currentInput = '0';
        previousInput = null;
        operator = null;
        resetDisplay = false;
        updateDisplay();
    };

    const handleBackspace = () => {
        if (currentInput.length > 1 && currentInput !== 'Error') {
            currentInput = currentInput.slice(0, -1);
        } else {
            currentInput = '0';
        }
        updateDisplay();
    };

    const handleSqrt = () => {
        const val = parseFloat(currentInput);
        if (val < 0) {
            currentInput = 'Error';
        } else {
            currentInput = Math.sqrt(val).toString();
            // clean up decimals
            currentInput = (Math.round(parseFloat(currentInput) * 10000000000) / 10000000000).toString();
        }
        resetDisplay = true;
        updateDisplay();
    };

    const handlePercent = () => {
        // Simple percent behavior: divides current number by 100
        const val = parseFloat(currentInput);
        currentInput = (val / 100).toString();
        resetDisplay = true;
        updateDisplay();
    };

    // Memory Functions
    const handleMemoryPlus = () => {
        memory += parseFloat(currentInput || '0');
        resetDisplay = true; // Usually starts a new input sequence
    };

    const handleMemoryMinus = () => {
        memory -= parseFloat(currentInput || '0');
        resetDisplay = true;
    };

    const handleMemoryRecallClear = () => {
        // Often MRC recalls on first press, clears on second.
        // For simplicity, let's just recall.
        // A more complex logic could be implemented if needed.

        // Let's try a simple check: if currently displaying memory, clear it.
        // But standard behavior varies. Let's stick to Recall for now, or Recall/Clear logic.
        // Implementation: If the last key pressed was MRC, then Clear. Otherwise Recall.
        // To do that properly we need to track last key.

        // Simplified: Recall
        currentInput = memory.toString();
        resetDisplay = true;
        updateDisplay();
    };


    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', () => {
            const value = button.dataset.value;
            const action = button.dataset.action;

            if (value) {
                if (['+', '-', '*', '/'].includes(value)) {
                    handleOperator(value);
                } else if (value === '.') {
                    handleDecimal();
                } else if (value === '00') {
                    handleDoubleZero();
                } else {
                    handleNumber(value);
                }
            } else if (action) {
                switch (action) {
                    case 'calculate':
                        calculate();
                        break;
                    case 'ac':
                        handleAllClear();
                        break;
                    case 'ce':
                        handleClearEntry();
                        break;
                    case 'backspace':
                        handleBackspace();
                        break;
                    case 'sqrt':
                        handleSqrt();
                        break;
                    case 'percent':
                        handlePercent();
                        break;
                    case 'm-plus':
                        handleMemoryPlus();
                        break;
                    case 'm-minus':
                        handleMemoryMinus();
                        break;
                    case 'mrc':
                        handleMemoryRecallClear();
                        break;
                }
            }
        });
    });
});
