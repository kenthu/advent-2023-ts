import { readLines } from 'lib/input';

const cardRegex = /^Card(?: +)\d+:([\d ]+) \|([\d ]+)$/;

interface Card {
  winningNums: Set<number>;
  cardNumbers: Set<number>;
  numMatches: number;
}

const ingestCards = (filename: string): Card[] => {
  const rows = readLines(filename);

  return rows.map((row) => {
    const matches = row.match(cardRegex);
    if (!matches) throw new Error(`Invalid row: ${row}`);

    const winningNums = new Set(splitNums(matches[1]));
    // Assuming that card numbers are unique
    const cardNumbers = new Set(splitNums(matches[2]));

    return {
      winningNums,
      cardNumbers,
      numMatches: winningNums.intersection(cardNumbers).size,
    };
  });
};

/**
 * Split a string of numbers up to 2 digits (like ' 69 82 63 72 16 21 14  1')
 */
const splitNums = (input: string): number[] => {
  const output: number[] = [];
  for (let i = 0; i < input.length / 3; i++) {
    output.push(Number(input.slice(i * 3, i * 3 + 3)));
  }
  return output;
};

const calculatePoints = (filename: string): number => {
  const cards = ingestCards(filename);

  return cards.reduce((acc, { numMatches }) => {
    if (numMatches > 0) {
      return acc + 2 ** (numMatches - 1);
    } else {
      return acc;
    }
  }, 0);
};

// Part 1 test
console.log(calculatePoints('src/day04/test-input.txt'));
// 13

// Part 1
console.log(calculatePoints('src/day04/input.txt'));
// 24706
