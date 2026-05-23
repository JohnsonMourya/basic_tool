const unitData = {
  length: {
    name: 'Length',
    units: [
      { id: 'millimeter', label: 'Millimeter (mm)', factor: 0.001 },
      { id: 'centimeter', label: 'Centimeter (cm)', factor: 0.01 },
      { id: 'meter', label: 'Meter (m)', factor: 1 },
      { id: 'kilometer', label: 'Kilometer (km)', factor: 1000 },
      { id: 'inch', label: 'Inch (in)', factor: 0.0254 },
      { id: 'foot', label: 'Foot (ft)', factor: 0.3048 },
      { id: 'yard', label: 'Yard (yd)', factor: 0.9144 },
      { id: 'mile', label: 'Mile (mi)', factor: 1609.344 },
      { id: 'nautical_mile', label: 'Nautical mile (nmi)', factor: 1852 },
    ]
  },
  weight: {
    name: 'Weight',
    units: [
      { id: 'milligram', label: 'Milligram (mg)', factor: 0.000001 },
      { id: 'gram', label: 'Gram (g)', factor: 0.001 },
      { id: 'kilogram', label: 'Kilogram (kg)', factor: 1 },
      { id: 'tonne', label: 'Tonne (t)', factor: 1000 },
      { id: 'ounce', label: 'Ounce (oz)', factor: 0.028349523125 },
      { id: 'pound', label: 'Pound (lb)', factor: 0.45359237 },
      { id: 'stone', label: 'Stone (st)', factor: 6.35029318 },
    ]
  },
  temperature: {
    name: 'Temperature',
    units: [
      { id: 'celsius', label: 'Celsius (°C)' },
      { id: 'fahrenheit', label: 'Fahrenheit (°F)' },
      { id: 'kelvin', label: 'Kelvin (K)' },
    ],
    toBase: { celsius: v => v + 273.15, fahrenheit: v => (v - 32) * 5 / 9 + 273.15, kelvin: v => v },
    fromBase: { celsius: v => v - 273.15, fahrenheit: v => (v - 273.15) * 9 / 5 + 32, kelvin: v => v },
  },
  volume: {
    name: 'Volume',
    units: [
      { id: 'milliliter', label: 'Milliliter (mL)', factor: 0.001 },
      { id: 'liter', label: 'Liter (L)', factor: 1 },
      { id: 'cubic_meter', label: 'Cubic meter (m³)', factor: 1000 },
      { id: 'cubic_centimeter', label: 'Cubic centimeter (cm³)', factor: 0.001 },
      { id: 'cubic_foot', label: 'Cubic foot (ft³)', factor: 28.316846592 },
      { id: 'cubic_inch', label: 'Cubic inch (in³)', factor: 0.016387064 },
      { id: 'gallon', label: 'Gallon (US gal)', factor: 3.785411784 },
      { id: 'quart', label: 'Quart (US qt)', factor: 0.946352946 },
      { id: 'pint', label: 'Pint (US pt)', factor: 0.473176473 },
      { id: 'cup', label: 'Cup (US cup)', factor: 0.2365882365 },
      { id: 'fluid_ounce', label: 'Fluid ounce (US fl oz)', factor: 0.02957352956 },
      { id: 'tablespoon', label: 'Tablespoon (US tbsp)', factor: 0.01478676478 },
      { id: 'teaspoon', label: 'Teaspoon (US tsp)', factor: 0.004928921594 },
    ]
  },
  area: {
    name: 'Area',
    units: [
      { id: 'square_millimeter', label: 'Square millimeter (mm²)', factor: 0.000001 },
      { id: 'square_centimeter', label: 'Square centimeter (cm²)', factor: 0.0001 },
      { id: 'square_meter', label: 'Square meter (m²)', factor: 1 },
      { id: 'square_kilometer', label: 'Square kilometer (km²)', factor: 1000000 },
      { id: 'square_inch', label: 'Square inch (in²)', factor: 0.00064516 },
      { id: 'square_foot', label: 'Square foot (ft²)', factor: 0.09290304 },
      { id: 'square_yard', label: 'Square yard (yd²)', factor: 0.83612736 },
      { id: 'square_mile', label: 'Square mile (mi²)', factor: 2589988.110336 },
      { id: 'hectare', label: 'Hectare (ha)', factor: 10000 },
      { id: 'acre', label: 'Acre', factor: 4046.8564224 },
    ]
  },
  speed: {
    name: 'Speed',
    units: [
      { id: 'meter_per_second', label: 'Meter/second (m/s)', factor: 1 },
      { id: 'kilometer_per_hour', label: 'Kilometer/hour (km/h)', factor: 0.2777777777778 },
      { id: 'mile_per_hour', label: 'Mile/hour (mph)', factor: 0.44704 },
      { id: 'foot_per_second', label: 'Foot/second (ft/s)', factor: 0.3048 },
      { id: 'knot', label: 'Knot (kn)', factor: 0.5144444444444 },
    ]
  },
  time: {
    name: 'Time',
    units: [
      { id: 'nanosecond', label: 'Nanosecond (ns)', factor: 1e-9 },
      { id: 'microsecond', label: 'Microsecond (µs)', factor: 1e-6 },
      { id: 'millisecond', label: 'Millisecond (ms)', factor: 0.001 },
      { id: 'second', label: 'Second (s)', factor: 1 },
      { id: 'minute', label: 'Minute (min)', factor: 60 },
      { id: 'hour', label: 'Hour (h)', factor: 3600 },
      { id: 'day', label: 'Day (d)', factor: 86400 },
      { id: 'week', label: 'Week (wk)', factor: 604800 },
      { id: 'month', label: 'Month (mo)', factor: 2628000 },
      { id: 'year', label: 'Year (yr)', factor: 31536000 },
    ]
  },
  data_storage: {
    name: 'Data Storage',
    units: [
      { id: 'bit', label: 'Bit (b)', factor: 1 / 8 },
      { id: 'byte', label: 'Byte (B)', factor: 1 },
      { id: 'kilobyte', label: 'Kilobyte (KB)', factor: 1000 },
      { id: 'megabyte', label: 'Megabyte (MB)', factor: 1000000 },
      { id: 'gigabyte', label: 'Gigabyte (GB)', factor: 1e9 },
      { id: 'terabyte', label: 'Terabyte (TB)', factor: 1e12 },
      { id: 'petabyte', label: 'Petabyte (PB)', factor: 1e15 },
    ]
  },
  energy: {
    name: 'Energy',
    units: [
      { id: 'joule', label: 'Joule (J)', factor: 1 },
      { id: 'kilojoule', label: 'Kilojoule (kJ)', factor: 1000 },
      { id: 'calorie', label: 'Calorie (cal)', factor: 4.184 },
      { id: 'kilocalorie', label: 'Kilocalorie (kcal)', factor: 4184 },
      { id: 'watt_hour', label: 'Watt-hour (Wh)', factor: 3600 },
      { id: 'kilowatt_hour', label: 'Kilowatt-hour (kWh)', factor: 3600000 },
      { id: 'electronvolt', label: 'Electronvolt (eV)', factor: 1.602176634e-19 },
      { id: 'btu', label: 'BTU', factor: 1055.0558525733 },
    ]
  },
  power: {
    name: 'Power',
    units: [
      { id: 'watt', label: 'Watt (W)', factor: 1 },
      { id: 'kilowatt', label: 'Kilowatt (kW)', factor: 1000 },
      { id: 'megawatt', label: 'Megawatt (MW)', factor: 1000000 },
      { id: 'gigawatt', label: 'Gigawatt (GW)', factor: 1e9 },
      { id: 'horsepower', label: 'Horsepower (hp)', factor: 745.6998715823 },
      { id: 'btu_per_hour', label: 'BTU/hour (BTU/h)', factor: 0.2930710701722 },
    ]
  },
  pressure: {
    name: 'Pressure',
    units: [
      { id: 'pascal', label: 'Pascal (Pa)', factor: 1 },
      { id: 'kilopascal', label: 'Kilopascal (kPa)', factor: 1000 },
      { id: 'megapascal', label: 'Megapascal (MPa)', factor: 1000000 },
      { id: 'bar', label: 'Bar', factor: 100000 },
      { id: 'psi', label: 'PSI', factor: 6894.7572931783 },
      { id: 'atmosphere', label: 'Atmosphere (atm)', factor: 101325 },
      { id: 'torr', label: 'Torr', factor: 133.3223684211 },
      { id: 'mmHg', label: 'Millimeter of mercury (mmHg)', factor: 133.322387415 },
    ]
  },
  fuel: {
    name: 'Fuel & Mileage',
    units: [
      { id: 'mpg', label: 'Miles per gallon (mpg)' },
      { id: 'liters_per_100km', label: 'Liters per 100 km (L/100km)' },
      { id: 'km_per_liter', label: 'Kilometers per liter (km/L)' },
    ],
    toBase: {
      mpg: v => 235.214583 / v,
      liters_per_100km: v => v,
      km_per_liter: v => 100 / v,
    },
    fromBase: {
      mpg: v => 235.214583 / v,
      liters_per_100km: v => v,
      km_per_liter: v => 100 / v,
    },
  },
};

let activeCategory = 'length';
let lastSource = 'from';

function populateUnits(category) {
  const cat = unitData[category];
  const fromSelect = document.getElementById('fromUnit');
  const toSelect = document.getElementById('toUnit');
  fromSelect.innerHTML = '';
  toSelect.innerHTML = '';

  cat.units.forEach(u => {
    fromSelect.add(new Option(u.label, u.id));
    toSelect.add(new Option(u.label, u.id));
  });

  if (cat.units.length > 1) {
    toSelect.selectedIndex = 1;
  }
}

function convert(category, fromUnitId, toUnitId, value) {
  if (isNaN(value) || value === '' || value === null) return '';
  const cat = unitData[category];

  if (cat.toBase && cat.fromBase) {
    const inBase = cat.toBase[fromUnitId](Number(value));
    return cat.fromBase[toUnitId](inBase);
  }

  const fromUnit = cat.units.find(u => u.id === fromUnitId);
  const toUnit = cat.units.find(u => u.id === toUnitId);
  if (!fromUnit || !toUnit) return '';

  const inBase = Number(value) * fromUnit.factor;
  return inBase / toUnit.factor;
}

function formatValue(v) {
  if (v === '' || v === null || v === undefined) return '';
  const num = Number(v);
  if (isNaN(num)) return '';
  if (num === 0) return '0';
  if (Math.abs(num) > 1e15 || (Math.abs(num) < 1e-10 && num !== 0)) {
    return num.toExponential(6);
  }
  const rounded = parseFloat(num.toPrecision(12));
  return String(rounded);
}

function updateResult(source) {
  const fromValue = document.getElementById('fromValue');
  const toValue = document.getElementById('toValue');
  const fromUnit = document.getElementById('fromUnit');
  const toUnit = document.getElementById('toUnit');

  if (source === 'from') {
    const result = convert(activeCategory, fromUnit.value, toUnit.value, fromValue.value);
    toValue.value = formatValue(result);
  } else {
    const result = convert(activeCategory, toUnit.value, fromUnit.value, toValue.value);
    fromValue.value = formatValue(result);
  }
}

function switchCategory(category) {
  activeCategory = category;
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.category === category);
  });
  populateUnits(category);
  document.getElementById('fromValue').value = '';
  document.getElementById('toValue').value = '';
}

function swapUnits() {
  const fromSelect = document.getElementById('fromUnit');
  const toSelect = document.getElementById('toUnit');
  const fromIdx = fromSelect.selectedIndex;
  const toIdx = toSelect.selectedIndex;
  fromSelect.selectedIndex = toIdx;
  toSelect.selectedIndex = fromIdx;
  updateResult('from');
}

function copyToClipboard(value) {
  navigator.clipboard.writeText(value).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = value;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  populateUnits('length');

  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', () => switchCategory(btn.dataset.category));
  });

  document.getElementById('fromValue').addEventListener('input', () => {
    lastSource = 'from';
    updateResult('from');
  });
  document.getElementById('toValue').addEventListener('input', () => {
    lastSource = 'to';
    updateResult('to');
  });
  document.getElementById('fromUnit').addEventListener('change', () => updateResult(lastSource));
  document.getElementById('toUnit').addEventListener('change', () => updateResult(lastSource));
  document.getElementById('swapBtn').addEventListener('click', swapUnits);

  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target;
      const value = document.getElementById(target + 'Value').value;
      if (value) copyToClipboard(value);
    });
  });

  document.getElementById('fromValue').addEventListener('focus', () => { lastSource = 'from'; });
  document.getElementById('toValue').addEventListener('focus', () => { lastSource = 'to'; });
});
