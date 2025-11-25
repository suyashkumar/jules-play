document.addEventListener('DOMContentLoaded', () => {
    const resultInput = document.getElementById('result');
    const buttons = document.querySelectorAll('.buttons button');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const buttonText = button.textContent;

            if (button.id === 'clear') {
                clearDisplay();
            } else if (button.id === 'equals') {
                calculateResult();
            } else {
                appendValue(buttonText);
            }
        });
    });

    function appendValue(value) {
        resultInput.value += value;
    }

    function clearDisplay() {
        resultInput.value = '';
    }

    function calculateResult() {
        const expression = resultInput.value;
        try {
            const result = parseExpression(expression);
            resultInput.value = result;
        } catch (error) {
            resultInput.value = 'Error';
        }
    }

    function precedence(op) {
        if (op === '+' || op === '-') {
            return 1;
        }
        if (op === '*' || op === '/') {
            return 2;
        }
        return 0;
    }

    function applyOp(op, b, a) {
        switch (op) {
            case '+':
                return a + b;
            case '-':
                return a - b;
            case '*':
                return a * b;
            case '/':
                if (b === 0) {
                    throw new Error("Division by zero");
                }
                return a / b;
        }
    }

    function parseExpression(expression) {
        const values = [];
        const ops = [];

        const tokens = expression.match(/(\d+\.?\d*)|([\+\-\*\/()])/g);

        if (!tokens) {
            throw new Error('Invalid expression');
        }

        let lastTokenWasOperator = true;

        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];

            if (!isNaN(parseFloat(token))) {
                values.push(parseFloat(token));
                lastTokenWasOperator = false;
            } else if (token === '-' && lastTokenWasOperator) {
                // Unary minus. Combine with the next token.
                const nextToken = tokens[i+1];
                if (nextToken && !isNaN(parseFloat(nextToken))) {
                    values.push(-parseFloat(nextToken));
                    i++; // Skip the next token
                    lastTokenWasOperator = false;
                } else {
                     throw new Error('Invalid expression');
                }
            } else {
                while (ops.length > 0 && precedence(ops[ops.length - 1]) >= precedence(token)) {
                    const val2 = values.pop();
                    const val1 = values.pop();
                    const op = ops.pop();
                    values.push(applyOp(op, val2, val1));
                }
                ops.push(token);
                lastTokenWasOperator = true;
            }
        }

        while (ops.length > 0) {
            const val2 = values.pop();
            const val1 = values.pop();
            const op = ops.pop();
            values.push(applyOp(op, val2, val1));
        }

        if (values.length > 1 || ops.length > 0) {
             throw new Error('Invalid expression');
        }

        return values[0];
    }
});
