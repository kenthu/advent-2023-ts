import { applyAlmanacRange } from './solution';

describe('applyAlmanacRange', () => {
  // INPUT:   |   |
  // ALMANAC:       |   |
  it('handles when input is before almanacRange, with no overlap', () => {
    expect(
      applyAlmanacRange(
        {
          sourceRangeStart: 30,
          destRangeStart: 1010,
          rangeLength: 11,
        },
        {
          rangeStart: 10,
          rangeEnd: 20,
        },
      ),
    ).toEqual({
      outputRanges: [],
      unmatchedInputRanges: [
        {
          rangeStart: 10,
          rangeEnd: 20,
        },
      ],
    });
  });

  // INPUT:         |   |
  // ALMANAC: |   |
  it('handles when input is after almanacRange, with no overlap', () => {
    expect(
      applyAlmanacRange(
        {
          sourceRangeStart: 10,
          destRangeStart: 1010,
          rangeLength: 11,
        },
        {
          rangeStart: 30,
          rangeEnd: 40,
        },
      ),
    ).toEqual({
      outputRanges: [],
      unmatchedInputRanges: [
        {
          rangeStart: 30,
          rangeEnd: 40,
        },
      ],
    });
  });

  // INPUT:       |       |
  // ALMANAC: |               |
  it('handles when input range entirely in almanac range', () => {
    expect(
      applyAlmanacRange(
        {
          sourceRangeStart: 10,
          destRangeStart: 1010,
          rangeLength: 31,
        },
        {
          rangeStart: 20,
          rangeEnd: 30,
        },
      ),
    ).toEqual({
      outputRanges: [
        {
          rangeStart: 1020,
          rangeEnd: 1030,
        },
      ],
      unmatchedInputRanges: [],
    });
  });

  // INPUT:   |               |
  // ALMANAC:     |       |
  it('handles when almanac range entirely in input range', () => {
    expect(
      applyAlmanacRange(
        {
          sourceRangeStart: 20,
          destRangeStart: 1020,
          rangeLength: 11,
        },
        {
          rangeStart: 10,
          rangeEnd: 40,
        },
      ),
    ).toEqual({
      outputRanges: [
        {
          rangeStart: 1020,
          rangeEnd: 1030,
        },
      ],
      unmatchedInputRanges: [
        {
          rangeStart: 10,
          rangeEnd: 19,
        },
        {
          rangeStart: 31,
          rangeEnd: 40,
        },
      ],
    });
  });

  it('handles when input range has some overlap with almanac range', () => {
    // INPUT:   |      |
    // ALMANAC:    |      |
    expect(
      applyAlmanacRange(
        {
          sourceRangeStart: 20,
          destRangeStart: 1020,
          rangeLength: 21,
        },
        {
          rangeStart: 10,
          rangeEnd: 30,
        },
      ),
    ).toEqual({
      outputRanges: [
        {
          rangeStart: 1020,
          rangeEnd: 1030,
        },
      ],
      unmatchedInputRanges: [
        {
          rangeStart: 10,
          rangeEnd: 19,
        },
      ],
    });
  });

  // INPUT:      |      |
  // ALMANAC: |      |
  expect(
    applyAlmanacRange(
      {
        sourceRangeStart: 10,
        destRangeStart: 1010,
        rangeLength: 21,
      },
      {
        rangeStart: 20,
        rangeEnd: 40,
      },
    ),
  ).toEqual({
    outputRanges: [
      {
        rangeStart: 1020,
        rangeEnd: 1030,
      },
    ],
    unmatchedInputRanges: [
      {
        rangeStart: 31,
        rangeEnd: 40,
      },
    ],
  });
});
