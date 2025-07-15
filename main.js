document.addEventListener('DOMContentLoaded', () => {
    const colors = {
        black: { value: 0, multiplier: 1, tolerance: 20 },
        brown: { value: 1, multiplier: 10, tolerance: 1 },
        red: { value: 2, multiplier: 100, tolerance: 2 },
        orange: { value: 3, multiplier: 1000, tolerance: 0.05 },
        yellow: { value: 4, multiplier: 10000, tolerance: 0.02 },
        green: { value: 5, multiplier: 100000, tolerance: 0.5 },
        blue: { value: 6, multiplier: 1000000, tolerance: 0.25 },
        violet: { value: 7, multiplier: 10000000, tolerance: 0.1 },
        grey: { value: 8, multiplier: 100000000, tolerance: 0.01 },
        white: { value: 9, multiplier: 1000000000, tolerance: 0 },
        gold: { value: -1, multiplier: 0.1, tolerance: 5 },
        silver: { value: -2, multiplier: 0.01, tolerance: 10 },
    };

    const colorHex = {
        black: '#000000',
        brown: '#a52a2a',
        red: '#ff0000',
        orange: '#ffa500',
        yellow: '#ffff00',
        green: '#008000',
        blue: '#0000ff',
        violet: '#ee82ee',
        grey: '#808080',
        white: '#ffffff',
        gold: '#ffd700',
        silver: '#c0c0c0',
    };

    const selectors = {
        selector1: document.getElementById('selector1'),
        selector2: document.getElementById('selector2'),
        selector3: document.getElementById('selector3'),
        selector4: document.getElementById('selector4'),
    };

    const bands = {
        band1: document.getElementById('band1'),
        band2: document.getElementById('band2'),
        band3: document.getElementById('band3'),
        band4: document.getElementById('band4'),
    };

    const resistanceEl = document.getElementById('resistance');

    function populateSelectors() {
        const digitColors = Object.keys(colors).filter(color => colors[color].value >= 0);
        const multiplierColors = Object.keys(colors);
        const toleranceColors = Object.keys(colors).filter(color => colors[color].tolerance !== undefined);

        populateDropdown(selectors.selector1, digitColors);
        populateDropdown(selectors.selector2, digitColors);
        populateDropdown(selectors.selector3, multiplierColors);
        populateDropdown(selectors.selector4, toleranceColors);
    }

    function populateDropdown(selector, colorList) {
        colorList.forEach(color => {
            const option = document.createElement('option');
            option.value = color;
            option.textContent = color.charAt(0).toUpperCase() + color.slice(1);
            selector.appendChild(option);
        });
    }

    function calculateResistance() {
        const val1 = colors[selectors.selector1.value].value;
        const val2 = colors[selectors.selector2.value].value;
        const multiplier = colors[selectors.selector3.value].multiplier;
        const tolerance = colors[selectors.selector4.value].tolerance;

        if (val1 === -1 || val2 === -1) {
            resistanceEl.textContent = 'N/A';
            return;
        }

        const resistance = (val1 * 10 + val2) * multiplier;
        const toleranceValue = `±${tolerance}%`;

        resistanceEl.textContent = `${formatResistance(resistance)} Ω ${toleranceValue}`;
        updateBands();
    }

    function formatResistance(resistance) {
        if (resistance >= 1000000000) {
            return `${resistance / 1000000000} G`;
        } else if (resistance >= 1000000) {
            return `${resistance / 1000000} M`;
        } else if (resistance >= 1000) {
            return `${resistance / 1000} k`;
        }
        return resistance;
    }

    function updateBands() {
        bands.band1.style.fill = colorHex[selectors.selector1.value];
        bands.band2.style.fill = colorHex[selectors.selector2.value];
        bands.band3.style.fill = colorHex[selectors.selector3.value];
        bands.band4.style.fill = colorHex[selectors.selector4.value];
    }

    Object.values(selectors).forEach(selector => {
        selector.addEventListener('change', calculateResistance);
    });

    populateSelectors();
    calculateResistance();
});
