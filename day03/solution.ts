import { readFileSync } from 'fs';

interface PartNumber {
  partNumber: number;
  rowIndex: number;
  colStartIndex: number;
  colEndIndex: number;
}

interface SymbolChar {
  character: string;
  rowIndex: number;
  colIndex: number;
}

const partNumbersFromRow = (row: string, rowIndex: number): PartNumber[] => {
  const maybePartNumbers = [];
  const numberMatches = row.matchAll(/(\d+)/g);
  for (const match of numberMatches) {
    if (match.index === undefined) {
      continue;
    }
    maybePartNumbers.push({
      partNumber: Number(match[0]),
      rowIndex,
      colStartIndex: match.index,
      colEndIndex: match.index + match[0].length - 1,
    });
  }
  return maybePartNumbers;
};

const symbolCharsFromRow = (row: string, rowIndex: number): SymbolChar[] => {
  const symbols: SymbolChar[] = [];
  const symbolMatches = row.matchAll(/([^\d.])/g);
  for (const match of symbolMatches) {
    if (match.index === undefined) {
      continue;
    }
    symbols.push({
      character: match[0],
      rowIndex,
      colIndex: match.index,
    });
  }

  return symbols;
};

const ingestInput = (filename: string): [PartNumber[], SymbolChar[]] => {
  const rows = readFileSync(filename, 'utf8').trim().split('\n');
  const maybePartNumbers: PartNumber[] = [];
  const symbols: SymbolChar[] = [];

  rows.forEach((row, rowIndex) => {
    maybePartNumbers.push(...partNumbersFromRow(row, rowIndex));
    symbols.push(...symbolCharsFromRow(row, rowIndex));
  });

  return [maybePartNumbers, symbols];
};

const isAdjacent = (symbol: SymbolChar, partNumber: PartNumber): boolean => {
  // Part number is above or below
  if (
    Math.abs(symbol.rowIndex - partNumber.rowIndex) === 1 &&
    symbol.colIndex >= partNumber.colStartIndex - 1 &&
    symbol.colIndex <= partNumber.colEndIndex + 1
  ) {
    return true;
  }

  // Part number is to the left or right
  if (
    symbol.rowIndex === partNumber.rowIndex &&
    (symbol.colIndex === partNumber.colEndIndex + 1 ||
      symbol.colIndex === partNumber.colStartIndex - 1)
  ) {
    return true;
  }

  return false;
};

const sumOfPartNumbers = (filename: string): number => {
  const inputs = ingestInput(filename);
  const maybePartNumbers = new Set(inputs[0]);
  const symbols = inputs[1];

  const validPartNumbers = new Set<PartNumber>();

  for (const symbol of symbols) {
    // We could optimize this by rearranging our partNumber data structure such that we can quickly
    // iterate over only the ones in rows adjacent to our symbol, but it's not worth the effort.
    for (const partNumber of maybePartNumbers) {
      if (isAdjacent(symbol, partNumber)) {
        maybePartNumbers.delete(partNumber);
        validPartNumbers.add(partNumber);
      }
    }
  }

  return [...validPartNumbers].map((partNumber) => partNumber.partNumber).reduce((a, b) => a + b);
};

const sumOfGearRatios = (filename: string): number => {
  const [maybePartNumbers, symbols] = ingestInput(filename);

  let sum = 0;

  for (const symbol of symbols.filter((symbol) => symbol.character === '*')) {
    const adjacentPartNumbers = maybePartNumbers.filter((partNumber) =>
      isAdjacent(symbol, partNumber),
    );
    if (adjacentPartNumbers.length === 2) {
      sum += adjacentPartNumbers[0].partNumber * adjacentPartNumbers[1].partNumber;
    }
  }

  return sum;
};

// Part 1 test
console.log(sumOfPartNumbers('day03/test-input.txt'));
// 4361

// Part 1
console.log(sumOfPartNumbers('day03/input.txt'));
// 529618

// Part 2 test
console.log(sumOfGearRatios('day03/test-input.txt'));
// 467835

// Part 2
console.log(sumOfGearRatios('day03/input.txt'));
// 77509019
