const band1 = document.getElementById('band1');
const band2 = document.getElementById('band2');
const multiplier = document.getElementById('multiplier');
const tolerance = document.getElementById('tolerance');
const resultValue = document.getElementById('result-value');

const band1El = document.querySelector('.band1');
const band2El = document.querySelector('.band2');
const band3El = document.querySelector('.band3');
const band4El = document.querySelector('.band4');

const colorMap = {
    '0': 'black',
    '1': 'brown',
    '2': 'red',
    '3': 'orange',
    '4': 'yellow',
    '5': 'green',
    '6': 'blue',
    '7': 'violet',
    '8': 'gray',
    '9': 'white',
    '0.1': 'gold',
    '0.01': 'silver'
};

const toleranceColorMap = {
    '1': 'brown',
    '2': 'red',
    '0.5': 'green',
    '0.25': 'blue',
    '0.1': 'violet',
    '0.05': 'gray',
    '5': 'gold',
    '10': 'silver'
};

function calculateResistance() {
    const b1 = band1.value;
    const b2 = band2.value;
    const mult = multiplier.value;
    const tol = tolerance.value;

    const resistance = (parseInt(b1 + b2) * parseFloat(mult));
    let resistanceStr;

    if (resistance >= 1000000) {
        resistanceStr = (resistance / 1000000) + 'M';
    } else if (resistance >= 1000) {
        resistanceStr = (resistance / 1000) + 'k';
    } else {
        resistanceStr = resistance;
    }

    resultValue.textContent = `${resistanceStr}Ω ±${tol}%`;

    band1El.style.backgroundColor = colorMap[b1];
    band2El.style.backgroundColor = colorMap[b2];
    const multiplierColor = Object.keys(colorMap).find(key => colorMap[key] === colorMap[multiplier.options[multiplier.selectedIndex].text.split(' ')[0].toLowerCase()]);
    band3El.style.backgroundColor = colorMap[Object.keys(colorMap).find(key => multiplier.options[multiplier.selectedIndex].text.toLowerCase().includes(colorMap[key]))] || 'black';
    band4El.style.backgroundColor = toleranceColorMap[tol];
}

band1.addEventListener('change', calculateResistance);
band2.addEventListener('change', calculateResistance);
multiplier.addEventListener('change', calculateResistance);
tolerance.addEventListener('change', calculateResistance);

calculateResistance();
