import { Interval } from "./Interval";
import { Note } from "./Note";

export class Chord {
  base: Note;
  intervals: Interval[];

  // some common chords
  static majorTriad = [new Interval("M3"), new Interval("m3")];
  static majorSeventh = [
    new Interval("M3"),
    new Interval("m3"),
    new Interval("M3"),
  ];
  static minorTriad = [new Interval("m3"), new Interval("M3")];
  static minorSeventh = [
    new Interval("m3"),
    new Interval("M3"),
    new Interval("m3"),
  ];
  static dominantSeventh = [
    new Interval("M3"),
    new Interval("m3"),
    new Interval("m3"),
  ];
  static diminishedTriad = [new Interval("m3"), new Interval("m3")];
  static diminishedSeventh = [
    new Interval("m3"),
    new Interval("m3"),
    new Interval("m3"),
  ];
  static halfDiminishedSeventh = [
    new Interval("m3"),
    new Interval("m3"),
    new Interval("M3"),
  ];

  constructor(note: Note, intervals: Interval[]) {
    this.base = note;
    this.intervals = intervals;
  }

  toString() {
    let acc = this.base + " ";
    let current = this.base;
    for (let interval of this.intervals) {
      current = current.addInterval(interval);
      acc += current + " ";
    }
    return acc.slice(0, -1);
  }
}
