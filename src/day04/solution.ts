import { readLines } from 'lib/input';

const cardRegex = /^Card(?: +)\d+:([\d ]+) \|([\d ]+)$/;

interface Card {
  numMatches: number;
}

const processCards = (filename: string): Card[] => {
  const rows = readLines(filename);

  return rows.map((row) => {
    const matches = row.match(cardRegex);
    if (!matches) throw new Error(`Invalid row: ${row}`);

    const winningNums = new Set(splitNums(matches[1]));
    // Assuming that card numbers are unique
    const cardNumbers = new Set(splitNums(matches[2]));

    return {
      numMatches: winningNums.intersection(cardNumbers).size,
    };
  });
};

/**
 * Split a string of numbers up to 2 digits (like ' 69 82 63 72 16 21 14  1')
 */
const splitNums = (input: string): number[] => {
  return input
    .split(' ')
    .filter((maybeNum) => maybeNum !== '')
    .map((numAsString) => Number(numAsString));
};

const calculatePoints = (filename: string): number => {
  const cards = processCards(filename);

  return cards.reduce((acc, { numMatches }) => {
    if (numMatches > 0) {
      return acc + 2 ** (numMatches - 1);
    } else {
      return acc;
    }
  }, 0);
};

const countCards = (filename: string): number => {
  const cards = processCards(filename);

  const cardCounts: Record<number, number> = {};
  // Start with one of each card
  for (let i = 0; i < cards.length; i++) {
    cardCounts[i] = 1;
  }

  for (let i = 0; i < cards.length; i++) {
    const currentCardCount = cardCounts[i];

    const currentMatches = cards[i].numMatches;
    // If have n matches, increment the next n cards by currentCardCount
    for (let indexToIncrement = i + 1; indexToIncrement <= i + currentMatches; indexToIncrement++) {
      cardCounts[indexToIncrement] += currentCardCount;
    }
  }

  return Object.values(cardCounts).reduce((acc, count) => acc + count, 0);
};

// Part 1 test
console.log(calculatePoints('src/day04/test-input.txt'));
// 13

// Part 1
console.log(calculatePoints('src/day04/input.txt'));
// 24706

// Part 2 test
console.log(countCards('src/day04/test-input.txt'));
// 30

// Part 2
console.log(countCards('src/day04/input.txt'));
// 13114317
