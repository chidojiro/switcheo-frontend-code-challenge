const isNatural = (n) => {
  return typeof n === 'number' && n >= 0 && n % 1 === 0;
};

const sum_to_n_a = (n) => {
  // your code here
  if (!isNatural(n)) {
    throw new Error('n must be a natural number');
  }

  return Math.abs((n * (n + 1)) / 2);
};

const sum_to_n_b = (n) => {
  // your code here
  if (!isNatural(n)) {
    throw new Error('n must be a natural number');
  }

  return new Array(n).fill(null).reduce((acc, _, i) => acc + i + 1, 0);
};

const sum_to_n_c = (n) => {
  // your code here
  if (!isNatural(n)) {
    throw new Error('n must be a natural number');
  }

  if (n === 0) {
    return 0;
  }

  return n + sum_to_n_c(n - 1);
};

console.log('sum_to_n_a', sum_to_n_a(5))
console.log('sum_to_n_b', sum_to_n_b(5))
console.log('sum_to_n_c', sum_to_n_c(5))