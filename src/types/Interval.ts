import { TwoWayMap } from "../utils/TwoWayMap";
import { InvalidInputError } from "./errorTypes";

type SimpleInterval = 1 | 2 | 3 | 4 | 5 | 6 | 7;

/**
 * Scale degrees to half-steps.
 */
export const IntervalValues = new TwoWayMap<SimpleInterval, number>({
  1: 0,
  2: 2,
  3: 4,
  4: 5,
  5: 7,
  6: 9,
  7: 11,
});

/**
 * Mapping between perfect qualities and its value.
 * For example, augmented interval raises the note up by one, so the value is 1.
 */
export const PerfectQualityValue = new TwoWayMap({
  P: 0,
  A: 1,
  d: -1,
});

/**
 * A perfect interval can be perfect (P), augmented (A) or diminished (d).
 */
export type PerfectQuality = "P" | "A" | "d";

export const PerfectQualitiesArray: PerfectQuality[] = ["P", "A", "d"];

/**
 * Mapping between imperfect qualities and its value.
 * For example, a minor interval lowers the note down by one, so the value is
 * -1.
 */
export const ImperfectQualityValue = new TwoWayMap({
  d: -2,
  m: -1,
  M: 0,
  A: 1,
});

/**
 * An imperfect interval can augmented (A), major (M), minor (m) or diminished
 * (d).
 */
export type ImperfectQuality = "d" | "m" | "M" | "A";

/**
 * An array containing all the values of type @link {ImperfectQuality}
 */
export const ImperfectQualitiesArray: ImperfectQuality[] = ["d", "m", "M", "A"];

/**
 * Represents an interval, without storing the notes on the two ends.
 */
export class Interval {
  /**
   * The quality of the note, can be perfect or imperfect depending on the
   * number.
   * @see {@link PerfectQuality} and {@link ImperfectQuality}
   */
  public quality: PerfectQuality | ImperfectQuality;
  /**
   * The generic interval.
   */
  public size: number;

  /**
   * Construct an interval from a string.
   * @param str a string representation of an interval, like "A3" (augmented third)
   * @remarks The interval string must be valid, here are some examples of invalid strings:
   * - `M5` (major fifth)
   * - `a0` (does not make any sense)
   * @throws Error if the string is invalid
   */
  constructor(str: string) {
    const [quality, size] = [str[0], str.slice(1)];
    if (!quality || isNaN(parseInt(size))) {
      throw new InvalidInputError("size", "size is not a non-negative integer");
    }
    // verify if the string makes sense
    if (Interval.checkIsPerfectInterval(+size)) {
      if (PerfectQualityValue.get(quality as PerfectQuality) === undefined) {
        throw new InvalidInputError(
          "quality",
          `quality "${quality}" does not exist in a perfect interval`
        );
      }
    } else {
      if (
        ImperfectQualityValue.get(quality as ImperfectQuality) === undefined
      ) {
        throw new InvalidInputError(
          "quality",
          `quality "${quality}" does not exist in a imperfect interval`
        );
      }
    }

    this.quality = quality as PerfectQuality | ImperfectQuality;
    this.size = +size;
  }

  /**
   * Calculates the number of half-steps of the interval.
   * @returns a non-negative integer that is the number of half-steps counted
   */
  valueOf() {
    let octaves;
    const remainingSize = this.size - 8; // first octave
    if (remainingSize === 0) {
      octaves = 1;
    } else if (remainingSize < 0) {
      octaves = 0;
    } else {
      octaves = 1 + Math.floor(remainingSize / 7);
    }
    const simpleDegree = IntervalValues.get(
      ((this.size + octaves) % 8) as SimpleInterval
    ) as number;
    const octaveInterval = octaves * 12;

    if (this.isPerfectInterval()) {
      return (
        octaveInterval +
        simpleDegree +
        PerfectQualityValue.get(this.quality as PerfectQuality)!
      );
    } else {
      return (
        octaveInterval +
        simpleDegree +
        ImperfectQualityValue.get(this.quality as ImperfectQuality)!
      );
    }
  }

  /**
   * Converts the interval back to the string representation.
   */
  toString() {
    return this.quality + this.size;
  }

  /**
   * Check if a generic interval is a perfect interval.
   * @param number a non-negative integer
   * @returns true if it is, false otherwise
   */
  // TODO: check negative intervals
  static checkIsPerfectInterval(number: number) {
    const remainder = number % 7;
    return remainder === 1 || remainder === 4 || remainder === 5;
  }

  /**
   * Check if the current interval is a perfect interval.
   * @returns true if it is, false otherwise
   */
  isPerfectInterval() {
    return Interval.checkIsPerfectInterval(this.size);
  }

  /**
   * Check if two intervals are the same. Both the size and quality shall be the same for it to return true. If `enharmonicallyEquivalent` is set, then they equal each other if the number of semitones are the same. See the description below.
   * @param rhs the interval to be compared
   * @param enharmonicallyEquivalent return true if two intervals span the same number of semitones
   * @returns a boolean indicating the result
   */
  equals(rhs: Interval, enharmonicallyEquivalent = false) {
    if (enharmonicallyEquivalent) {
      return this.valueOf() === rhs.valueOf();
    } else {
      return this.size === rhs.size && this.quality === rhs.quality;
    }
  }
}
