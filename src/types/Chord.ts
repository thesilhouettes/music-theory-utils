import { Interval } from "./Interval";
import { Note } from "./Note";

export class Chord {
  base: Note;
  intervals: Interval[];

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
