import { TwoWayMap } from "../utils/TwoWayMap";

type SimpleInterval = 1 | 2 | 3 | 4 | 5 | 6 | 7;

const IntervalValues = new TwoWayMap<SimpleInterval, number>({
  1: 0,
  2: 2,
  3: 4,
  4: 5,
  5: 7,
  6: 9,
  7: 11,
});

export const PerfectQualityValue = new TwoWayMap({
  P: 0,
  A: 1,
  d: -1,
});

export type PerfectQuality = "P" | "A" | "d";

export const ImperfectQualityValue = new TwoWayMap({
  d: -2,
  m: -1,
  M: 0,
  A: 1,
});

export type ImperfectQuality = "d" | "m" | "M" | "A";

export class Interval {
  public quality: PerfectQuality | ImperfectQuality;
  public number: number;

  constructor(str: string) {
    const [quality, number] = [str[0], str.slice(1)];
    if (!quality || isNaN(parseInt(number))) {
      throw new Error("The interval string is invalid");
    }
    // verify if the string makes sense
    if (this.checkIsPerfectInterval(+number)) {
      if (PerfectQualityValue.get(quality as PerfectQuality) === undefined) {
        throw new Error("This quality does not exist in a perfect interval");
      }
    } else {
      if (
        ImperfectQualityValue.get(quality as ImperfectQuality) === undefined
      ) {
        throw new Error("This quality does not exist in an imperfect interval");
      }
    }

    this.quality = quality as PerfectQuality | ImperfectQuality;
    this.number = +number;
  }

  valueOf() {
    const octaves = Math.floor(this.number / 8);
    const simpleDegree = IntervalValues.get(
      ((this.number + octaves) % 8) as SimpleInterval
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

  toString() {
    return this.quality + this.number;
  }

  private checkIsPerfectInterval(number: number) {
    const remainder = number % 7;
    return remainder === 1 || remainder === 4 || remainder === 5;
  }

  isPerfectInterval() {
    return this.checkIsPerfectInterval(this.number);
  }
}
