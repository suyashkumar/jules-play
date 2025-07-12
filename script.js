document.addEventListener('DOMContentLoaded', () => {
    const bands = {
        band1: document.getElementById('band1'),
        band2: document.getElementById('band2'),
        band3: document.getElementById('band3'),
        band4: document.getElementById('band4'),
    };

    const previews = {
        band1: document.getElementById('preview-band1'),
        band2: document.getElementById('preview-band2'),
        band3: document.getElementById('preview-band3'),
        band4: document.getElementById('preview-band4'),
    };

    const resistorValueDisplay = document.getElementById('resistor-value');

    const colors = {
        black:  { value: 0, multiplier: 1, tolerance: null, color: '#000000' },
        brown:  { value: 1, multiplier: 10, tolerance: 1, color: '#a52a2a' },
        red:    { value: 2, multiplier: 100, tolerance: 2, color: '#ff0000' },
        orange: { value: 3, multiplier: 1000, tolerance: null, color: '#ffa500' },
        yellow: { value: 4, multiplier: 10000, tolerance: null, color: '#ffff00' },
        green:  { value: 5, multiplier: 100000, tolerance: 0.5, color: '#008000' },
        blue:   { value: 6, multiplier: 1000000, tolerance: 0.25, color: '#0000ff' },
        violet: { value: 7, multiplier: 10000000, tolerance: 0.1, color: '#ee82ee' },
        grey:   { value: 8, multiplier: 100000000, tolerance: 0.05, color: '#808080' },
        white:  { value: 9, multiplier: 1000000000, tolerance: null, color: '#ffffff' },
        gold:   { value: null, multiplier: 0.1, tolerance: 5, color: '#ffd700' },
        silver: { value: null, multiplier: 0.01, tolerance: 10, color: '#c0c0c0' },
        none:   { value: null, multiplier: null, tolerance: 20, color: '#f0f0f0' }
    };

    function populateOptions() {
        Object.keys(colors).forEach(colorName => {
            const colorData = colors[colorName];
            const option = new Option(colorName.charAt(0).toUpperCase() + colorName.slice(1), colorName);

            // Band 1 & 2 (significant figures)
            if (colorData.value !== null) {
                bands.band1.add(option.cloneNode(true));
                bands.band2.add(option.cloneNode(true));
            }
            // Band 3 (multiplier)
            if (colorData.multiplier !== null) {
                bands.band3.add(option.cloneNode(true));
            }
            // Band 4 (tolerance)
            if (colorData.tolerance !== null) {
                bands.band4.add(option.cloneNode(true));
            }
        });
         // Add "None" option for tolerance
        bands.band4.add(new Option("None", "none"));
    }

    function calculateResistorValue() {
        const b1 = bands.band1.value;
        const b2 = bands.band2.value;
        const b3 = bands.band3.value;
        const b4 = bands.band4.value;

        const val1 = colors[b1].value;
        const val2 = colors[b2].value;
        const multiplier = colors[b3].multiplier;
        const tolerance = colors[b4].tolerance;

        if (val1 === null || val2 === null || multiplier === null) {
            resistorValueDisplay.textContent = 'Invalid selection';
            return;
        }

        const baseValue = (val1 * 10 + val2) * multiplier;

        let displayValue;
        if (baseValue >= 1000000000) {
            displayValue = (baseValue / 1000000000) + ' GΩ';
        } else if (baseValue >= 1000000) {
            displayValue = (baseValue / 1000000) + ' MΩ';
        } else if (baseValue >= 1000) {
            displayValue = (baseValue / 1000) + ' KΩ';
        } else {
            displayValue = baseValue + ' Ω';
        }

        resistorValueDisplay.textContent = `${displayValue} ±${tolerance}%`;

        // Update previews
        previews.band1.style.backgroundColor = colors[b1].color;
        previews.band2.style.backgroundColor = colors[b2].color;
        previews.band3.style.backgroundColor = colors[b3].color;
        previews.band4.style.backgroundColor = colors[b4].color;
    }

    Object.values(bands).forEach(band => {
        band.addEventListener('change', calculateResistorValue);
    });

    populateOptions();
    // Set default values to match the image (Green, Violet, Orange, Gold)
    bands.band1.value = 'green';
    bands.band2.value = 'violet';
    bands.band3.value = 'orange';
    bands.band4.value = 'gold';
    calculateResistorValue();
});
