document.addEventListener('DOMContentLoaded', () => {
    const resultInput = document.getElementById('result');
    const buttons = document.querySelector('.buttons');

    let currentInput = '0';
    let operator = '';
    let previousInput = '';
    let memory = 0;
    let memoryRecall = false;

    const updateDisplay = () => {
        resultInput.value = currentInput;
    };

    const calculate = () => {
        let result;
        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);

        if (isNaN(prev) || isNaN(current)) return;

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
                result = prev / current;
                break;
            default:
                return;
        }
        currentInput = result.toString();
        operator = '';
        previousInput = '';
    };

    buttons.addEventListener('click', (e) => {
        if (!e.target.matches('button')) return;

        const button = e.target;
        const action = button.innerText;
        const classList = button.classList;

        if (classList.contains('number')) {
            if (currentInput === '0' || memoryRecall) {
                currentInput = '';
                memoryRecall = false;
            }
            currentInput += action;
        }

        if (classList.contains('decimal')) {
            if (!currentInput.includes('.')) {
                currentInput += '.';
            }
        }

        if (classList.contains('operator')) {
            if (action === '√') {
                currentInput = Math.sqrt(parseFloat(currentInput)).toString();
            } else if (action === '%') {
                currentInput = (parseFloat(currentInput) / 100).toString();
            } else if (action === '->') {
                currentInput = currentInput.slice(0, -1) || '0';
            } else if (action === '=') {
                calculate();
            } else {
                if (operator) {
                    calculate();
                }
                previousInput = currentInput;
                currentInput = '0';
                operator = action;
            }
        }

        if (classList.contains('clear')) {
            if (action === 'AC') {
                currentInput = '0';
                operator = '';
                previousInput = '';
            } else if (action === 'CE') {
                currentInput = '0';
            }
        }

        if (classList.contains('memory')) {
            memoryRecall = false;
            if (action === 'M+') {
                memory += parseFloat(currentInput);
            } else if (action === 'M-') {
                memory -= parseFloat(currentInput);
            } else if (action === 'MRC') {
                currentInput = memory.toString();
                memoryRecall = true;
            }
        }

        updateDisplay();
    });

    updateDisplay();
});
