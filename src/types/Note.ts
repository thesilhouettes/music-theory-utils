import { TwoWayMap } from "../utils/TwoWayMap";
import { Interval } from "./Interval";

/**
 * Represent how the key letters map to a position within an octave
 * Starts from `0`
 */
export const LetterValues = new TwoWayMap<Letter, number>({
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
});

/**
 * Represent the available note letter inside an octave
 */
export type Letter = "C" | "D" | "E" | "F" | "G" | "A" | "B";

/**
 * Represents a simple mapping between letter names to a number
 * Also a zero-indexed C major scale degrees
 */
export const DegreeValues = new TwoWayMap<Letter, number>({
  C: 0,
  D: 1,
  E: 2,
  F: 3,
  G: 4,
  A: 5,
  B: 6,
});

/**
 * Represents a mapping between accidentals and the modifying value
 * For example, since a sharp raises a half step, the value of it is "+1"
 */
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

/**
 * Represents the available accidental names
 */
export type Accidental = "b" | "bb" | "bbb" | "#" | "x" | "#x" | "";

/**
 * Represents the available octave numbers, and `null` if the note is relative
 */
export type Octave = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | null;

/**
 * Represents a note in music.
 */
export class Note {
  /**
   * note name without quality, like white keys on a piano
   * for the quality, please refer to {@link Note.accidental}
   */
  pitch: Letter;
  /**
   * which octave the note is in
   * if the value is `null`, then do not care about the octave
   * these kinds of notes are reffered as **relative notes**
   */
  octave: Octave;
  /**
   * the quality of that note.
   */
  accidental: Accidental;

  /**
   * constructs an instace of `Note`
   *
   * @param pitch the not name without quality
   * @param accidental the quality of the note, default `""`
   * @param octave the octave number, default `null`
   */
  constructor(pitch: Letter, accidental?: Accidental, octave?: Octave) {
    this.pitch = pitch;
    this.accidental = accidental || "";
    this.octave = octave || null;
  }

  /**
   * calculates where the note is
   * @returns 0 to 11 if the note is relative, positive integer if the note is absolute
   */
  get value() {
    const add =
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

  /**
   * Calculate the number of half steps between the current note and an input
   * note
   * @remarks currently only returns the absolute difference between the two notes
   * @param rhs another note
   * @returns a non-negative integer representing the number of half steps between two notes
   */
  interval(rhs: Note) {
    return Math.abs(this.value - rhs.value);
  }

  // static fromAbsoluteNoteValue(absoluteValue: number, accidental: Accidental) {}

  // static fromNoteValue(
  //   value: number,
  //   accidental: Accidental,
  //   octave?: number
  // ) {}

  // static from(str: string) {
  //   // TODO: return a Note from the string representation
  // }

  /**
   * Checks if the input notes have the same "type" as the current note.
   * A type is either relative or absolute.
   * @see {@link Note.octave}
   * @param notes the input notes to check
   * @returns true if they are the same type, false otherwise
   */
  static isAllTheSameType(...notes: Note[]) {
    if (!notes.length) {
      return true;
    }
    const first = notes[0].octave !== null;
    for (const note of notes) {
      if (first && note.octave === null) {
        return false;
      }
      if (!first && note.octave !== null) {
        return false;
      }
    }
    return true;
  }

  /**
   * Add a degree number to a letter, ignoring the quality
   * If the degree is negative, then it will count downards.
   * @param letter the base letter
   * @param degree how many steps to add, can be negative.
   * @returns a new letter
   *
   * @example
   * ```ts
   * Note.addLetter("A", 2); // "B"
   * ```
   */
  static addLetter(letter: Letter, degree: number) {
    const index = DegreeValues.get(letter)!;
    if (degree > 1) {
      return DegreeValues.getRev((index + degree - 1) % 7)!;
    } else if (degree < -1) {
      const remainder = (index + degree) % 7;
      return DegreeValues.getRev(
        remainder > 0 ? remainder + 1 : remainder + 8
      )!;
    } else {
      return letter;
    }
  }

  /**
   * Add an interval to the current note
   * @param interval the interval to be added
   * @returns a new note after adding
   *
   * @example
   * ```ts
   * new Note("C", "#")
   *   .addInterval(new Interval("P5"))
   *   .equals(new Note("G", "#")) // true
   * ```
   */
  addInterval(interval: Interval) {
    const nextLetter = Note.addLetter(this.pitch, interval.number);

    // find which note fits
    const nextInterval = (this.value + +interval) % 12;
    const nextLetterValue = LetterValues.get(nextLetter)!;
    // now we only focus on simple intervals
    for (const accidental of ["", "#", "b", "x", "bb", "#x", "bbb"]) {
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

  /**
   * Check if two notes are equal
   *
   *  Two notes are said to be equal if they have:
   *  - the same pitch
   *  - the same octave (or same type)
   *  - the same quality
   * @param rhs another note to compare
   * @returns true if they are equal, false otherwise
   */
  equals(rhs: Note) {
    return (
      this.pitch === rhs.pitch &&
      this.octave === rhs.octave &&
      this.accidental === rhs.accidental
    );
  }

  /**
   *
   * @returns a string representation of the note
   *
   * @example
   * ```ts
   * let note = new Note("A", "#", 3);
   * console.log(note.toString()); // "A#3"
   * ```
   */
  toString() {
    return this.pitch + this.accidental + (this.octave ?? "");
  }
}
