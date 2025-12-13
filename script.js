document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display');
    const memoryIndicator = document.getElementById('memory-indicator');
    const buttons = document.querySelectorAll('.btn');

    let currentInput = '0';
    let previousInput = null;
    let operator = null;
    let memory = 0;
    let resetNext = false;
    let mrcCount = 0; // To handle double click logic for MRC if needed (Standard: 1 click recall, 2 clicks clear)

    const updateDisplay = (value) => {
        // Limit display length to avoid overflow, e.g., 12 digits
        const stringValue = value.toString();
        if (stringValue.length > 12) {
             display.textContent = stringValue.substring(0, 12);
        } else {
            display.textContent = stringValue;
        }
    };

    const updateMemoryIndicator = () => {
        if (memory !== 0) {
            memoryIndicator.classList.add('visible');
        } else {
            memoryIndicator.classList.remove('visible');
        }
    };

    const calculate = (a, b, op) => {
        const num1 = parseFloat(a);
        const num2 = parseFloat(b);
        switch (op) {
            case 'add': return num1 + num2;
            case 'subtract': return num1 - num2;
            case 'multiply': return num1 * num2;
            case 'divide': return num2 !== 0 ? num1 / num2 : 'Error';
            default: return num2;
        }
    };

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const action = button.dataset.action;
            const value = button.dataset.value;

            // Handle Numbers and Dot
            if (value !== undefined) {
                // If we just finished a calculation or pressed an operator, start new input
                if (resetNext) {
                    currentInput = value === '.' ? '0.' : value;
                    resetNext = false;
                } else {
                    if (value === '.') {
                        if (!currentInput.includes('.')) {
                            currentInput += value;
                        }
                    } else if (value === '00') {
                        if (currentInput !== '0') {
                            currentInput += value;
                        }
                    } else {
                        if (currentInput === '0') {
                            currentInput = value;
                        } else {
                            currentInput += value;
                        }
                    }
                }
                mrcCount = 0; // Reset MRC counter on other actions
                updateDisplay(currentInput);
            }

            // Handle Operations
            if (action) {
                // Common operations
                if (['add', 'subtract', 'multiply', 'divide'].includes(action)) {
                    if (operator && !resetNext && previousInput !== null) {
                        const result = calculate(previousInput, currentInput, operator);
                        currentInput = String(result);
                        updateDisplay(currentInput);
                    }
                    previousInput = currentInput;
                    operator = action;
                    resetNext = true;
                    mrcCount = 0;
                }

                // Equals
                if (action === 'equals') {
                    if (operator && previousInput !== null) {
                        const result = calculate(previousInput, currentInput, operator);
                        currentInput = String(result);
                        updateDisplay(currentInput);
                        previousInput = null;
                        operator = null;
                        resetNext = true;
                    }
                    mrcCount = 0;
                }

                // Clear functions
                if (action === 'all-clear') {
                    currentInput = '0';
                    previousInput = null;
                    operator = null;
                    resetNext = false;
                    updateDisplay(currentInput);
                    mrcCount = 0;
                }

                if (action === 'clear-entry') {
                    currentInput = '0';
                    updateDisplay(currentInput);
                    mrcCount = 0;
                }

                if (action === 'backspace') {
                    if (currentInput.length > 1) {
                        currentInput = currentInput.slice(0, -1);
                    } else {
                        currentInput = '0';
                    }
                    updateDisplay(currentInput);
                    mrcCount = 0;
                }

                // Math functions
                if (action === 'sqrt') {
                    currentInput = String(Math.sqrt(parseFloat(currentInput)));
                    updateDisplay(currentInput);
                    resetNext = true;
                    mrcCount = 0;
                }

                if (action === 'percent') {
                    // Standard percent behavior: value / 100
                    // Or if in operation: 100 + 10% -> 110.
                    // Let's implement simple percent first (value/100)
                    // If we have an operator (e.g. 50 * 10 %), it usually means 50 * 0.1
                    currentInput = String(parseFloat(currentInput) / 100);
                    updateDisplay(currentInput);
                    // If used in middle of operation, we probably don't reset next immediately unless we treat it as input
                    // But usually on calculators pressing % executes the pending op with the percent value?
                    // Let's stick to simple conversion for now.
                    // resetNext = true; // Maybe?
                    mrcCount = 0;
                }

                // Memory functions
                if (action === 'memory-plus') {
                    memory += parseFloat(currentInput);
                    resetNext = true;
                    updateMemoryIndicator();
                    mrcCount = 0;
                }

                if (action === 'memory-minus') {
                    memory -= parseFloat(currentInput);
                    resetNext = true;
                    updateMemoryIndicator();
                    mrcCount = 0;
                }

                if (action === 'memory-recall') {
                    if (mrcCount === 0) {
                        // First click: Recall
                        currentInput = String(memory);
                        updateDisplay(currentInput);
                        resetNext = true;
                        mrcCount = 1;
                    } else {
                        // Second click: Clear Memory
                        memory = 0;
                        updateMemoryIndicator();
                        mrcCount = 0;
                        // display stays same
                    }
                }
            }
        });
    });
});
