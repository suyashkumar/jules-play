
function calculate(expression) {
    // Basic validation to prevent unsafe characters
    if (/[^0-9+\-*/. ]/.test(expression) || expression.trim() === '') {
        return 'Error';
    }

    try {
        // Improved tokenizer to handle negative numbers
        const tokens = [];
        let currentNumber = '';
        for (let i = 0; i < expression.length; i++) {
            const char = expression[i];
            if ('0' <= char && char <= '9' || char === '.') {
                currentNumber += char;
            } else if ('+-*/'.includes(char)) {
                if (currentNumber !== '') {
                    tokens.push(currentNumber);
                    currentNumber = '';
                }
                // Handle unary minus
                if (char === '-' && (tokens.length === 0 || '+-*/'.includes(tokens[tokens.length - 1]))) {
                    currentNumber += char;
                } else {
                    tokens.push(char);
                }
            }
        }
        if (currentNumber !== '') {
            tokens.push(currentNumber);
        }

        // Operator precedence map
        const precedence = { '*': 2, '/': 2, '+': 1, '-': 1 };

        // Shunting-yard algorithm implementation
        const values = []; // Operand stack
        const ops = [];   // Operator stack

        const applyOp = () => {
            const op = ops.pop();
            const right = values.pop();
            const left = values.pop();
            if (left === undefined || right === undefined) throw new Error("Invalid expression");

            switch (op) {
                case '+': values.push(left + right); break;
                case '-': values.push(left - right); break;
                case '*': values.push(left * right); break;
                case '/':
                    if (right === 0) throw new Error("Division by zero");
                    values.push(left / right);
                    break;
            }
        };

        for (const token of tokens) {
            if (!isNaN(parseFloat(token))) {
                values.push(parseFloat(token));
            } else if (token in precedence) {
                // While there's an operator on the stack with higher or equal precedence, apply it
                while (ops.length > 0 && precedence[ops[ops.length - 1]] >= precedence[token]) {
                    applyOp();
                }
                ops.push(token);
            } else {
                return 'Error'; // Invalid token
            }
        }

        // Apply remaining operators
        while (ops.length > 0) {
            applyOp();
        }

        // The final result should be the only item in the values stack
        if (values.length !== 1 || ops.length > 0) {
           return 'Error';
        }

        return values[0];

    } catch (error) {
        return 'Error';
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const resultInput = document.getElementById('result');
    const buttons = document.querySelectorAll('button');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.dataset.value;

            if (value === 'C') {
                resultInput.value = '';
            } else if (value === '=') {
                const result = calculate(resultInput.value);
                resultInput.value = result;
            } else {
                resultInput.value += value;
            }
        });
    });
});
