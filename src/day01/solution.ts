import { readFileSync } from 'fs';

const RE_FIRST_DIGIT = /(\d)/;
const RE_LAST_DIGIT = /.*(\d)/;
const RE_FIRST_DIGIT_WITH_WORDS = /(\d|one|two|three|four|five|six|seven|eight|nine)/;
const RE_LAST_DIGIT_WITH_WORDS = /.*(\d|one|two|three|four|five|six|seven|eight|nine)/;

/**
 * @returns calibration values
 */
const ingestInput = (filename: string): string[] => {
  return readFileSync(filename, 'utf8').trim().split('\n');
};

const getDigit = (regex: RegExp, corruptValue: string): string => {
  const matches = corruptValue.match(regex);
  if (!matches) {
    throw new Error(`Unable to parse value: ${corruptValue}`);
  }
  switch (matches[1]) {
    case 'one':
      return '1';
    case 'two':
      return '2';
    case 'three':
      return '3';
    case 'four':
      return '4';
    case 'five':
      return '5';
    case 'six':
      return '6';
    case 'seven':
      return '7';
    case 'eight':
      return '8';
    case 'nine':
      return '9';
    default:
      return matches[1];
  }
};

const fixValue = (corruptValue: string, reFirstDigit: RegExp, reLastDigit: RegExp): number => {
  return Number(`${getDigit(reFirstDigit, corruptValue)}${getDigit(reLastDigit, corruptValue)}`);
};

const sumOfFixedValues = (filename: string, reFirstDigit: RegExp, reLastDigit: RegExp): number => {
  const corruptValues = ingestInput(filename);
  const fixedValues = corruptValues.map((corruptValue) =>
    fixValue(corruptValue, reFirstDigit, reLastDigit),
  );
  return fixedValues.reduce((a, b) => a + b);
};

// Part 1 test
console.log(sumOfFixedValues('src/day01/test-input-1.txt', RE_FIRST_DIGIT, RE_LAST_DIGIT));
// 142

// Part 1
console.log(sumOfFixedValues('src/day01/input.txt', RE_FIRST_DIGIT, RE_LAST_DIGIT));
// 54667

// Part 2 test
console.log(
  sumOfFixedValues(
    'src/day01/test-input-2.txt',
    RE_FIRST_DIGIT_WITH_WORDS,
    RE_LAST_DIGIT_WITH_WORDS,
  ),
);
// 281

// Part 2
console.log(
  sumOfFixedValues('src/day01/input.txt', RE_FIRST_DIGIT_WITH_WORDS, RE_LAST_DIGIT_WITH_WORDS),
);
// 54203
