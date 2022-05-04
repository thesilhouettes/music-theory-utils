import { TwoWayMap } from "../utils/TwoWayMap";
import { Interval } from "./Interval";

export const LetterValues = new TwoWayMap<Letter, number>({
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
});

export type Letter = "C" | "D" | "E" | "F" | "G" | "A" | "B";

export const DegreeValues = new TwoWayMap<Letter, number>({
  C: 0,
  D: 1,
  E: 2,
  F: 3,
  G: 4,
  A: 5,
  B: 6,
});

export const AccidentalValues = new TwoWayMap<Accidental, number>({
  b: -1,
  //  "♭" : -1, // U+226D
  bb: -2,
  //  "𝄫" : -2, // U+1D12B
  bbb: -3,
  //  "♭𝄫" : -3, // I am not so sure about this one
  "#": +1,
  // "♯" : +1, // U+266F
  x: +2,
  "#x": +3,
  // "𝄪" : +2, // U+1D12A
  // "♮" : 0, // U+266E
  // "♯𝄪" : +3,
  "": 0,
});

export type Accidental = "b" | "bb" | "bbb" | "#" | "x" | "#x" | "";

export type Octave = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | null;

export class Note {
  pitch: Letter;
  octave: Octave;
  accidental: Accidental;

  constructor(pitch: Letter, accidental?: Accidental, octave?: Octave) {
    this.pitch = pitch;
    this.accidental = accidental || "";
    this.octave = octave || null;
  }

  get value() {
    let add =
      LetterValues.get(this.pitch)! + AccidentalValues.get(this.accidental)!;
    // loop around if it is out of [0, 11]
    if (add > 11) {
      return add - 12;
    } else if (add < 0) {
      return add + 12;
    } else {
      return add;
    }
  }

  get absoluteValue() {
    // TODO: return the correct value
    return 1;
  }

  interval(rhs: Note) {
    return Math.abs(this.value - rhs.value);
  }

  absoluteInterval() {
    // TODO: return the correct value
    return 1;
  }

  static fromAbsoluteNoteValue(absoluteValue: number, accidental: Accidental) {}

  static fromNoteValue(
    value: number,
    accidental: Accidental,
    octave?: number
  ) {}

  static from(str: string) {
    // TODO: return a Note from the string representation
  }

  static isAllTheSameType(...notes: Note[]) {
    if (!notes.length) {
      return true;
    }
    let first = notes[0].octave !== null;
    for (let note of notes) {
      if (first && note.octave === null) {
        return false;
      }
      if (!first && note.octave !== null) {
        return false;
      }
    }
    return true;
  }

  static addLetter(letter: Letter, degree: number) {
    let index = DegreeValues.get(letter)!;
    if (degree > 1) {
      return DegreeValues.getRev((index + degree - 1) % 7)!;
    } else if (degree < -1) {
      let remainder = (index + degree) % 7;
      return DegreeValues.getRev(
        remainder > 0 ? remainder + 1 : remainder + 8
      )!;
    } else {
      return letter;
    }
  }

  addInterval(interval: Interval) {
    const nextLetter = Note.addLetter(this.pitch, interval.number);

    // find which note fits
    let nextInterval = (this.value + +interval) % 12;
    let nextLetterValue = LetterValues.get(nextLetter)!;
    // now we only focus on simple intervals
    for (let accidental of ["", "#", "b", "x", "bb", "#x", "bbb"]) {
      let withAccidental =
        nextLetterValue + AccidentalValues.get(accidental as Accidental)!;
      if (withAccidental >= 12) {
        withAccidental -= 12;
      } else if (withAccidental < 0) {
        withAccidental += 12;
      }
      if (withAccidental === nextInterval) {
        return new Note(nextLetter, accidental as Accidental);
      }
    }
    throw new Error("No accidental matches this interval!");
  }

  equals(rhs: Note) {
    return (
      this.pitch === rhs.pitch &&
      this.octave === rhs.octave &&
      this.accidental === rhs.accidental
    );
  }

  toString() {
    return this.pitch + this.accidental + (this.octave ?? "");
  }
}
