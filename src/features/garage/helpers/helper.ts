const carBrands = [
  'Tesla',
  'Ford',
  'BMW',
  'Deepal',
  'Honda',
  'Mercedes',
  'Jaguar',
];

export function generateCars() {
  return {
    name: carBrands[Math.floor(Math.random() * carBrands.length)],
    color: '#' + Math.floor(Math.random() * 16777215).toString(16),
  };
}
