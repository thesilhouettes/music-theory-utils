import { TwoWayMap } from "../utils/TwoWayMap";
import { Interval } from "./Interval";

/**
 * Represent how the key letters map to a position within an octave.
 * Starts from `0`.
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
 * Represent the available note letter inside an octave.
 */
export type Letter = "C" | "D" | "E" | "F" | "G" | "A" | "B";

/**
 * Represents a simple mapping between letter names to a number
 * Also a zero-indexed C major scale degrees.
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
 * Represents a mapping between accidentals and the modifying value.
 * For example, since a sharp raises a half step, the value of it is "+1".
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
 * Represents the available accidental names.
 */
export type Accidental = "b" | "bb" | "bbb" | "#" | "x" | "#x" | "";

/**
 * Represents the available octave numbers, and `null` if the note is relative.
 */
export type Octave = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | null;

/**
 * Represents a note in music.
 */
export class Note {
  /**
   * note name without quality, like white keys on a piano.
   * For `quality`, please refer to {@link Note.accidental}
   */
  pitch: Letter;
  /**
   * Which octave the note is in.
   * If the value is `null`, that means it is a relative note.
   * That means all relative notes are treated like they are on the same octave.
   */
  octave: Octave;
  /**
   * The quality of that note. (how sharp or flat it is).
   */
  accidental: Accidental;

  /**
   * The lowest note position in this library. It is in negative since I have
   * chosen A0 as the zeroth position
   */
  static C0_POSITION = -9;

  /**
   * There are 88 keys in the piano, and the index starts from 0
   */
  static C8_POSITION = 87;

  /**
   * How many white keys and black keys are there in an octave
   */
  static POSITIONS_PER_OCTAVE = 12;
  /**
   * Constructs an instance of `Note`
   *
   * @param pitch the note name without quality
   * @param accidental the quality of the note, default `""`
   * @param octave the octave number, default `null`
   */
  constructor(pitch: Letter, accidental?: Accidental, octave?: Octave) {
    this.pitch = pitch;
    this.accidental = accidental || "";
    this.octave = octave || null;
  }

  /**
   * Calculates where the note is.
   * @returns 0 to 11 if the note is relative, positive integer if the note is absolute
   */
  get value() {
    const remainder =
      LetterValues.get(this.pitch)! + AccidentalValues.get(this.accidental)!;
    // absolute case
    if (this.octave !== null) {
      const octaveBase =
        Note.C0_POSITION + this.octave * Note.POSITIONS_PER_OCTAVE;
      return octaveBase + remainder;
    }
    // loop around if it is out of [0, 11]
    if (remainder > 11) {
      return remainder - 12;
    } else if (remainder < 0) {
      return remainder + 12;
    } else {
      return remainder;
    }
  }

  /**
   * Calculate the number of half steps between the current note and an input
   * note. The number is counted like this: the first note is exclusive, while the second note is inclusive.
   * @example
   * ```ts
   * new Note("C").difference(new Note("A")) // 9
   * ```
   * @remarks may return negative values if the first note is lower than the second note, also applies for relative notes
   * @param rhs another note
   * @returns an integer representing the number of half steps between two notes
   */
  difference(rhs: Note) {
    if (!Note.isAllTheSameType(this, rhs)) {
      throw new Error("The notes are not the same type");
    }
    const diff = rhs.value - this.value;
    // handle the relative case first
    if (this.octave === null) {
      if (diff < 0) {
        return -(12 + diff);
      }
    }
    return diff;
  }

  /**
   * Returns a new note base on the position and accidental.
   * @param absoluteValue the absolute position. Must be an integer between
   * @link {Note.C0_POSITION} and @link {Note.C8_POSITION}
   * @param accidental since there are enharmonic notes, an accidental should be
   * provided to resolve the ambiguity
   * @returns a new note
   */
  static fromAbsolutePosition(
    absoluteValue: number,
    accidental?: Accidental
  ): Note {
    if (absoluteValue < Note.C0_POSITION || absoluteValue > Note.C8_POSITION) {
      throw new Error(
        "the position is out of range. (Allowed region: C0 to C8)"
      );
    }
    if (!Number.isInteger(absoluteValue)) {
      throw new Error("value is not an integer");
    }
    const octave = Math.floor(
      (absoluteValue - Note.C0_POSITION) / Note.POSITIONS_PER_OCTAVE
    ) as Octave;
    let remainder =
      ((absoluteValue - Note.C0_POSITION) % Note.POSITIONS_PER_OCTAVE) -
      AccidentalValues.get(accidental ?? "")!;
    // sometimes remainder may go beyond 11 and 0, we need to loop around
    if (remainder < 0) {
      remainder += 12;
    } else if (remainder > 11) {
      remainder -= 12;
    }
    const letter = LetterValues.getRev(remainder);
    if (!letter) {
      throw new Error(
        "a note with this accidental does not exist for this position"
      );
    }
    return new Note(letter, accidental, octave);
  }

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
    const firstIsAbsolute = notes[0].octave !== null;
    for (const note of notes) {
      if (firstIsAbsolute && note.octave === null) {
        return false;
      }
      if (!firstIsAbsolute && note.octave !== null) {
        return false;
      }
    }
    return true;
  }

  /**
   * Add a degree number to a letter, ignoring the quality.
   * If the degree is negative, then it will count downwards.
   * @param letter the base letter
   * @param degree how many steps to add, can be negative.
   * @returns a new letter
   * @throws Error if degree is 0 or not integer
   *
   * @example
   * ```ts
   * Note.addLetter("A", 2); // "B"
   * ```
   */
  static addLetter(letter: Letter, degree: number) {
    if (degree === 0 || !Number.isInteger(degree)) {
      throw new Error("invalid degree");
    }
    const index = DegreeValues.get(letter)!;
    if (degree > 1) {
      return DegreeValues.getRev((index + degree - 1) % 7)!;
    } else if (degree == 1) {
      return letter;
    }
    // degree < -1
    else {
      const remainder = (index + degree) % 7;
      return DegreeValues.getRev(
        remainder > 0 ? remainder + 1 : remainder + 8
      )!;
    }
  }

  /**
   * Add an interval to the current note.
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

    let nextInterval;
    if (this.octave !== null) {
      nextInterval = (this.value - Note.C0_POSITION + +interval) % 12;
    } else {
      nextInterval = (this.value + +interval) % 12;
    }
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
        if (this.octave !== null) {
          const nextNotePosition = this.value + +interval;
          return Note.fromAbsolutePosition(
            nextNotePosition,
            accidental as Accidental
          );
        }
        return new Note(nextLetter, accidental as Accidental);
      }
    }
    throw new Error("No accidental matches this interval!");
  }

  /**
   * Check if two notes are equal.
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
