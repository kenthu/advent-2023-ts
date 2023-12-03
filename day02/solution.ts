import { readFileSync } from 'fs';

type Game = Handful[];

type Handful = Partial<Record<Color, number>>;

type Color = 'blue' | 'red' | 'green';

const isColor = (input: string): input is Color => {
  return ['blue', 'red', 'green'].includes(input);
};

const MAXIMUMS: Record<Color, number> = {
  red: 12,
  green: 13,
  blue: 14,
};

/**
 * Parse handful string into Handful object
 * @param handfulUnparsed Example: "3 blue, 4 red"
 */
const parseHandful = (handfulUnparsed: string): Handful => {
  const handful: Handful = {};
  for (const countColorPair of handfulUnparsed.split(', ')) {
    const [count, color] = countColorPair.split(' ');
    if (!isColor(color)) {
      throw new Error(`Invalid color: ${color}`);
    }

    handful[color] = Number(count);
  }
  return handful;
};

/**
 * Parse handfuls string into array of Handfuls
 * @param handfuls Example: "3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green"
 */
const parseHandfuls = (handfuls: string): Handful[] => {
  return handfuls.split('; ').map((handful) => parseHandful(handful));
};

const ingestInput = (filename: string): Record<string, Game> => {
  const gameLines = readFileSync(filename, 'utf8').trim().split('\n');

  const games: Record<string, Game> = {};
  for (const line of gameLines) {
    // Example line: "Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green"
    const matches = line.match(/^Game (\d+): ([a-z\d,; ]+)$/);
    if (!matches) {
      throw new Error(`Unable to parse line: ${line}`);
    }
    const [_, gameId, handfulsUnparsed] = matches;
    games[gameId] = parseHandfuls(handfulsUnparsed);
  }
  return games;
};

const isGamePossible = (game: Game): boolean => {
  for (const handful of game) {
    for (const [color, count] of Object.entries(handful)) {
      if (count > MAXIMUMS[color as Color]) {
        return false;
      }
    }
  }

  return true;
};

const sumOfIdsOfValidGames = (filename: string): number => {
  const games = ingestInput(filename);
  const validGameIds = Object.entries(games).map(([gameId, game]) =>
    isGamePossible(game) ? Number(gameId) : 0,
  );
  return validGameIds.reduce((a, b) => a + b);
};

const powerOfMinSet = (game: Game): number => {
  const minSetNeeded = game.reduce((a, b) => ({
    blue: Math.max(a.blue ?? 0, b.blue ?? 0),
    red: Math.max(a.red ?? 0, b.red ?? 0),
    green: Math.max(a.green ?? 0, b.green ?? 0),
  }));
  return (minSetNeeded.blue ?? 0) * (minSetNeeded.red ?? 0) * (minSetNeeded.green ?? 0);
};

const sumOfPowersOfMinSets = (filename: string): number => {
  const games = Object.values(ingestInput(filename));
  return games.map((game) => powerOfMinSet(game)).reduce((a, b) => a + b);
};

// Part 1 test
console.log(sumOfIdsOfValidGames('day02/test-input.txt'));
// 8

// Part 1
console.log(sumOfIdsOfValidGames('day02/input.txt'));
// 2771

// Part 2 test
console.log(sumOfPowersOfMinSets('day02/test-input.txt'));
// 2286

// Part 2
console.log(sumOfPowersOfMinSets('day02/input.txt'));
// 70924
