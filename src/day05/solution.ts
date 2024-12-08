import { chunk } from 'lodash';

import { readLines } from 'lib/input';

interface FactorRange {
  rangeStart: number;
  rangeEnd: number;
}

type MapType =
  | 'seed-to-soil'
  | 'soil-to-fertilizer'
  | 'fertilizer-to-water'
  | 'water-to-light'
  | 'light-to-temperature'
  | 'temperature-to-humidity'
  | 'humidity-to-location';

interface AlmanacRange {
  sourceRangeStart: number;
  destRangeStart: number;
  rangeLength: number;
}

type AlmanacMap = AlmanacRange[];

type AllMaps = Record<MapType, AlmanacMap>;

const processMapInput = (mapLines: string[]): AllMaps => {
  const allMaps = {} as AllMaps;
  let currentMapType: MapType = 'seed-to-soil';

  const mapHeaderRegex = /^([a-z-]+) map:$/;

  for (const line of mapLines) {
    if (line === '') {
      continue;
    }

    const matches = line.match(mapHeaderRegex);
    if (matches) {
      // Start a new map
      currentMapType = matches[1] as MapType;
      allMaps[currentMapType] = [];
      continue;
    }

    const [destRangeStart, sourceRangeStart, rangeLength] = line
      .split(' ')
      .map((numString) => Number(numString));

    allMaps[currentMapType].push({
      sourceRangeStart,
      destRangeStart,
      rangeLength,
    });
  }

  return allMaps;
};

const processInputForPart1 = (
  filename: string,
): {
  seeds: number[];
  allMaps: AllMaps;
} => {
  const lines = readLines(filename);

  return {
    seeds: lines[0]
      .slice(7)
      .split(' ')
      .map((numString) => Number(numString)),
    allMaps: processMapInput(lines.slice(2)),
  };
};

const processInputForPart2 = (
  filename: string,
): {
  seedRanges: FactorRange[];
  allMaps: AllMaps;
} => {
  const lines = readLines(filename);

  return {
    seedRanges: chunk(
      lines[0]
        .slice(7)
        .split(' ')
        .map((numString) => Number(numString)),
      2,
    ).map(([rangeStart, rangeLength]) => ({
      rangeStart,
      rangeEnd: rangeStart + rangeLength - 1,
    })),
    allMaps: processMapInput(lines.slice(2)),
  };
};

const lookupMap = (map: AlmanacMap, input: number): number => {
  for (const { sourceRangeStart, destRangeStart, rangeLength } of map) {
    if (input >= sourceRangeStart && input < sourceRangeStart + rangeLength) {
      const shift = input - sourceRangeStart;
      return destRangeStart + shift;
    }
  }
  return input;
};

const part1 = (filename: string): number => {
  const { seeds, allMaps } = processInputForPart1(filename);

  return Math.min(
    ...seeds.map((seed) => {
      const soil = lookupMap(allMaps['seed-to-soil'], seed);
      const fertilizer = lookupMap(allMaps['soil-to-fertilizer'], soil);
      const water = lookupMap(allMaps['fertilizer-to-water'], fertilizer);
      const light = lookupMap(allMaps['water-to-light'], water);
      const temperature = lookupMap(allMaps['light-to-temperature'], light);
      const humidity = lookupMap(allMaps['temperature-to-humidity'], temperature);
      const location = lookupMap(allMaps['humidity-to-location'], humidity);

      return location;
    }),
  );
};

const isValidRange = (factorRange: FactorRange): boolean =>
  factorRange.rangeStart <= factorRange.rangeEnd;

export const applyAlmanacRange = (
  almanacRange: AlmanacRange,
  inputRange: FactorRange,
): {
  outputRanges: FactorRange[];
  unmatchedInputRanges: FactorRange[];
} => {
  const inputStart = inputRange.rangeStart;
  const inputEnd = inputRange.rangeEnd;
  const almanacStart = almanacRange.sourceRangeStart;
  const almanacEnd = almanacRange.sourceRangeStart + almanacRange.rangeLength - 1;

  // Move this to test file!

  // No overlap
  // ----------
  // INPUT:   |   |
  // ALMANAC:       |   |
  // or
  // INPUT:         |   |
  // ALMANAC: |   |

  // Input range entirely in almanac range => full match
  // ---------------------------------------------------
  // INPUT:       |       |
  // ALMANAC: |               |

  // Almanac range entirely in input range => match the middle part of input range
  // -----------------------------------------------------------------------------
  // INPUT:   |               |
  // ALMANAC:     |       |

  // Offset
  // ------
  // INPUT:   |      |
  // ALMANAC:    |      |
  // or
  // INPUT:      |      |
  // ALMANAC: |      |

  // Calculate output from overlap
  const shift = almanacRange.destRangeStart - almanacRange.sourceRangeStart;
  const outputRange = {
    rangeStart: Math.max(inputStart, almanacStart) + shift,
    rangeEnd: Math.min(inputEnd, almanacEnd) + shift,
  };

  const inputRangeBeforeAlmanac = {
    rangeStart: inputStart,
    rangeEnd: Math.min(inputEnd, almanacStart - 1),
  };

  const inputRangeAfterAlmanac = {
    rangeStart: Math.max(inputStart, almanacEnd + 1),
    rangeEnd: inputEnd,
  };

  return {
    outputRanges: [outputRange].filter((range) => isValidRange(range)),
    unmatchedInputRanges: [inputRangeBeforeAlmanac, inputRangeAfterAlmanac].filter((range) =>
      isValidRange(range),
    ),
  };
};

const processMap = (map: AlmanacMap, inputRanges: FactorRange[]): FactorRange[] => {
  let remainingInputRanges = [...inputRanges];
  const allOutputRanges = [];

  for (const almanacRange of map) {
    const newRemainingInputRanges = [];

    for (const inputRange of remainingInputRanges) {
      const { outputRanges, unmatchedInputRanges } = applyAlmanacRange(almanacRange, inputRange);

      allOutputRanges.push(...outputRanges);
      newRemainingInputRanges.push(...unmatchedInputRanges);
    }
    remainingInputRanges = newRemainingInputRanges;
  }

  // Any remaining unmatched input ranges can just be converted to output ranges
  allOutputRanges.push(...remainingInputRanges);

  return allOutputRanges;
};

const part2 = (filename: string): number => {
  const { seedRanges, allMaps } = processInputForPart2(filename);

  const soilRanges = processMap(allMaps['seed-to-soil'], seedRanges);
  const fertilizerRanges = processMap(allMaps['soil-to-fertilizer'], soilRanges);
  const waterRanges = processMap(allMaps['fertilizer-to-water'], fertilizerRanges);
  const lightRanges = processMap(allMaps['water-to-light'], waterRanges);
  const temperatureRanges = processMap(allMaps['light-to-temperature'], lightRanges);
  const humidityRanges = processMap(allMaps['temperature-to-humidity'], temperatureRanges);
  const locationRanges = processMap(allMaps['humidity-to-location'], humidityRanges);

  return locationRanges.reduce((min, range) => Math.min(min, range.rangeStart), Infinity);
};

// Part 1 test
console.log(part1('src/day05/test-input.txt'));
// 35

// Part 1
console.log(part1('src/day05/input.txt'));
// 388071289

// Part 2 test
console.log(part2('src/day05/test-input.txt'));
// 46

// Part 2
console.log(part2('src/day05/input.txt'));
// 84206669
