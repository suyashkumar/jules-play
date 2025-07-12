document.addEventListener('DOMContentLoaded', () => {
    const resistorValueDisplay = document.getElementById('resistor-value');
    const wheels = {
        band1: document.getElementById('band1-wheel'),
        band2: document.getElementById('band2-wheel'),
        band3: document.getElementById('band3-wheel'),
        band4: document.getElementById('band4-wheel'),
    };

    const colors = {
        black:  { value: 0, multiplier: 1, tolerance: null, color: '#222' }, // Darker for visibility
        brown:  { value: 1, multiplier: 10, tolerance: 1, color: '#a52a2a' },
        red:    { value: 2, multiplier: 100, tolerance: 2, color: '#ff0000' },
        orange: { value: 3, multiplier: 1000, tolerance: null, color: '#ffa500' },
        yellow: { value: 4, multiplier: 10000, tolerance: null, color: '#e5e500' }, // Darker
        green:  { value: 5, multiplier: 100000, tolerance: 0.5, color: '#008000' },
        blue:   { value: 6, multiplier: 1000000, tolerance: 0.25, color: '#0000ff' },
        violet: { value: 7, multiplier: 10000000, tolerance: 0.1, color: '#ee82ee' },
        grey:   { value: 8, multiplier: 100000000, tolerance: 0.05, color: '#808080' },
        white:  { value: 9, multiplier: 1000000000, tolerance: null, color: '#eee' }, // Greyish
        gold:   { value: null, multiplier: 0.1, tolerance: 5, color: '#ffd700' },
        silver: { value: null, multiplier: 0.01, tolerance: 10, color: '#c0c0c0' },
        none:   { value: null, multiplier: null, tolerance: 20, color: '#444' } // For tolerance
    };

    const swatchHeight = 40; // Must match CSS
    const pickerHeight = 150; // Must match CSS

    function createSwatch(colorName, colorData) {
        const swatch = document.createElement('div');
        swatch.className = 'color-swatch';
        swatch.dataset.name = colorName;
        swatch.style.backgroundColor = colorData.color;
        // Make text visible on light backgrounds
        if (['yellow', 'white', 'gold', 'silver'].includes(colorName)) {
            swatch.style.color = '#333';
            swatch.style.textShadow = 'none';
        }
        return swatch;
    }

    function populateWheels() {
        const padding = document.createElement('div');
        padding.style.height = `${(pickerHeight - swatchHeight) / 2}px`;
        padding.style.scrollSnapAlign = 'start';

        const paddingEnd = padding.cloneNode(true);
        paddingEnd.style.scrollSnapAlign = 'end';

        // Populate Band 1 & 2 (significant figures)
        const sigFigColors = Object.entries(colors).filter(([_, data]) => data.value !== null);
        [wheels.band1, wheels.band2].forEach(wheel => {
            wheel.appendChild(padding.cloneNode(true));
            sigFigColors.forEach(([name, data]) => wheel.appendChild(createSwatch(name, data)));
            wheel.appendChild(paddingEnd.cloneNode(true));
        });

        // Populate Band 3 (multiplier)
        const multiplierColors = Object.entries(colors).filter(([_, data]) => data.multiplier !== null);
        wheels.band3.appendChild(padding.cloneNode(true));
        multiplierColors.forEach(([name, data]) => wheels.band3.appendChild(createSwatch(name, data)));
        wheels.band3.appendChild(paddingEnd.cloneNode(true));

        // Populate Band 4 (tolerance)
        const toleranceColors = Object.entries(colors).filter(([_, data]) => data.tolerance !== null);
        wheels.band4.appendChild(padding.cloneNode(true));
        toleranceColors.forEach(([name, data]) => wheels.band4.appendChild(createSwatch(name, data)));
        wheels.band4.appendChild(paddingEnd.cloneNode(true));
    }

    function getSelectedColor(wheel) {
        const scrollTop = wheel.scrollTop;
        const centeredIndex = Math.round(scrollTop / swatchHeight);
        const swatch = wheel.children[centeredIndex + 1]; // +1 to account for padding div
        return swatch ? swatch.dataset.name : null;
    }

    function calculateResistorValue() {
        const b1 = getSelectedColor(wheels.band1);
        const b2 = getSelectedColor(wheels.band2);
        const b3 = getSelectedColor(wheels.band3);
        const b4 = getSelectedColor(wheels.band4);

        if (!b1 || !b2 || !b3 || !b4) return;

        const val1 = colors[b1].value;
        const val2 = colors[b2].value;
        const multiplier = colors[b3].multiplier;
        const tolerance = colors[b4].tolerance;

        if (val1 === null || val2 === null || multiplier === null || tolerance === null) {
            resistorValueDisplay.textContent = 'Invalid';
            return;
        }

        const baseValue = (val1 * 10 + val2) * multiplier;

        let displayValue;
        if (baseValue >= 1000000000) {
            displayValue = (baseValue / 1000000000).toPrecision(3) + ' GΩ';
        } else if (baseValue >= 1000000) {
            displayValue = (baseValue / 1000000).toPrecision(3) + ' MΩ';
        } else if (baseValue >= 1000) {
            displayValue = (baseValue / 1000).toPrecision(3) + ' KΩ';
        } else {
            displayValue = baseValue.toPrecision(3) + ' Ω';
        }

        // Remove trailing zeros from precision, e.g. 5.70 -> 5.7
        displayValue = displayValue.replace(/(\.[0-9]*[1-9])0+/, "$1").replace(/\.$/, "");


        resistorValueDisplay.textContent = `${displayValue} ±${tolerance}%`;
    }

    function snapScroll(wheel) {
        const scrollTop = wheel.scrollTop;
        const targetIndex = Math.round(scrollTop / swatchHeight);
        wheel.scrollTo({ top: targetIndex * swatchHeight, behavior: 'smooth' });
    }

    Object.values(wheels).forEach(wheel => {
        let scrollTimeout;
        wheel.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                snapScroll(wheel);
                calculateResistorValue();
            }, 150); // Adjust delay as needed
        });
    });

    function setInitialValue() {
        // Green, Violet, Orange, Gold -> 57 KΩ ±5%
        const initialSelections = {
            band1: 'green', // 5
            band2: 'violet', // 7
            band3: 'orange', // 1k
            band4: 'gold' // 5%
        };

        Object.entries(initialSelections).forEach(([wheelId, colorName]) => {
            const wheel = wheels[wheelId];
            const swatches = Array.from(wheel.children);
            const targetIndex = swatches.findIndex(s => s.dataset && s.dataset.name === colorName);
            if (targetIndex > -1) {
                // targetIndex-1 because of the padding div at the start
                wheel.scrollTop = (targetIndex-1) * swatchHeight;
            }
        });
        calculateResistorValue();
    }

    populateWheels();
    setInitialValue();
});
