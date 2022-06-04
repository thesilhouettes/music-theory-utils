import { TwoWayMap } from "../utils/TwoWayMap";
import {
  ImpossibleQualityError,
  InvalidInputError,
  NotSameTypeError,
  OutOfRegionError,
} from "./errorTypes";
import { Interval } from "./Interval";

/**
 * Represent how the key letters map to a position within an octave.
 * Starts from `0`.
 */
export const LETTER_VALUES = new TwoWayMap<Letter, number>({
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
 * All values of @link {Letter} packed into an array
 */
export const LETTERS_ARRAY: Letter[] = ["C", "D", "E", "F", "G", "A", "B"];

/**
 * Represents a simple mapping between letter names to a number
 * Also a zero-indexed C major scale degrees.
 */
export const DEGREE_VALUES = new TwoWayMap<Letter, number>({
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
export const ACCIDENTAL_VALUES = new TwoWayMap<Accidental, number>({
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
 * All values of accidentals packed into an array
 */
export const ACCIDENTALS_ARRAY: Accidental[] = [
  "b",
  "bb",
  "bbb",
  "#",
  "x",
  "#x",
  "",
];

/**
 * A map between accidentals and their English names
 */
export const ACCIDENTAL_NAMES = new TwoWayMap<Accidental, string>({
  "#": "sharp",
  "": "natural",
  x: "double sharp",
  "#x": "triple sharp",
  b: "flat",
  bb: "double flat",
  bbb: "triple flat",
});

/**
 * This function will change `x` (double sharp) into `##` and `` (natural) into `n`s. If the accidental is not one of them then it is returned unchanged
 * @param accidental the accidental you want to change
 * @returns An alternative representation
 */
export function alternativeAccidental(accidental: Accidental) {
  switch (accidental) {
    case "x":
      return "##";
    case "":
      return "n";
    default:
      return accidental;
  }
}

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
      LETTER_VALUES.get(this.pitch)! + ACCIDENTAL_VALUES.get(this.accidental)!;
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
   * @throws NotSameTypeError if the input notes do not have the same type
   */
  difference(rhs: Note) {
    if (!Note.isAllTheSameType(this, rhs)) {
      throw new NotSameTypeError();
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
   * @throws OutOfRegionError if number is out of C0 or C8, or InvalidInputError
   * if number is not an integer
   */
  static fromAbsolutePosition(
    absoluteValue: number,
    accidental?: Accidental
  ): Note {
    if (!Number.isInteger(absoluteValue)) {
      throw new InvalidInputError("value", "It is not an integer");
    }
    if (absoluteValue < Note.C0_POSITION || absoluteValue > Note.C8_POSITION) {
      throw new OutOfRegionError(absoluteValue);
    }
    let octave = Math.floor(
      (absoluteValue - Note.C0_POSITION) / Note.POSITIONS_PER_OCTAVE
    ) as Exclude<Octave, null>;
    let remainder =
      ((absoluteValue - Note.C0_POSITION) % Note.POSITIONS_PER_OCTAVE) -
      ACCIDENTAL_VALUES.get(accidental ?? "")!;
    // sometimes remainder may go beyond 11 and 0, we need to loop around
    if (remainder < 0) {
      remainder += 12;
      octave -= 1;
    } else if (remainder > 11) {
      remainder -= 12;
      octave += 1;
    }
    const letter = LETTER_VALUES.getRev(remainder);
    if (!letter) {
      throw new ImpossibleQualityError(
        "a note with this accidental does not exist for this position"
      );
    }
    return new Note(letter, accidental, octave as Octave);
  }

  /**
   * Converts a string representation of note to a `Note`.
   * @example
   * ```ts
   * Note.from("Cbb5") // { pitch: "C", accidental: "bb", octave: 5}
   * Note.from("E4") // { pitch: "E", accidental: "", octave: 4 }
   * Note.from("B9") // InvalidInputError
   * ```
   * @param str the string to be converted
   * @returns a new instance of `Note`
   * @throws InvalidInputError if either `pitch`, `accidental` or `octave` is invalid
   */
  static from(str: string) {
    const matcher = /^([A-G])(#x|#|x|b+)?(\d)?$/;
    const results = str.match(matcher);
    if (!results) {
      throw new InvalidInputError(
        "str",
        "The whole string representation is invalid"
      );
    }
    const note = results[1];
    const accidental = results[2] ?? "";
    const octave = results[3];

    if (ACCIDENTAL_VALUES.get(accidental as Accidental) === undefined) {
      throw new InvalidInputError(
        "accidental",
        "This is not a valid accidental"
      );
    }
    const octaveAsNumber = Number.parseInt(octave);
    if (octaveAsNumber && (octaveAsNumber < 0 || octaveAsNumber > 8)) {
      throw new InvalidInputError("octave", "This is not a valid octave");
    }

    return new Note(
      note as Letter,
      accidental as Accidental,
      octaveAsNumber as Octave
    );
  }

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
   * @throws InvalidInputError if degree is 0 or not integer
   *
   * @example
   * ```ts
   * Note.addLetter("A", 2); // "B"
   * ```
   */
  static addLetter(letter: Letter, degree: number) {
    if (degree === 0 || !Number.isInteger(degree)) {
      throw new InvalidInputError("degree", "Degree is invalid");
    }
    const index = DEGREE_VALUES.get(letter)!;
    if (degree > 1) {
      return DEGREE_VALUES.getRev((index + degree - 1) % 7)!;
    } else if (degree == 1) {
      return letter;
    }
    // degree < -1
    else {
      const remainder = (index + degree) % 7;
      return DEGREE_VALUES.getRev(
        remainder > 0 ? remainder + 1 : remainder + 8
      )!;
    }
  }

  /**
   * Add an interval to the current note.
   * @param interval the interval to be added
   * @returns a new note after adding
   * @throws ImpossibleQualityError if the interval requires notation more than
   * triple flats and triple sharps
   * @example
   * ```ts
   * new Note("C", "#")
   *   .addInterval(new Interval("P5"))
   *   .equals(new Note("G", "#")) // true
   * ```
   */
  addInterval(interval: Interval) {
    const nextLetter = Note.addLetter(this.pitch, interval.size);

    // find which note fits
    let nextInterval;
    if (this.octave !== null) {
      nextInterval = (this.value - Note.C0_POSITION + +interval) % 12;
    } else {
      nextInterval = (this.value + +interval) % 12;
    }
    const nextLetterValue = LETTER_VALUES.get(nextLetter)!;
    // now we only focus on simple intervals
    for (const accidental of ["", "#", "b", "x", "bb", "#x", "bbb"]) {
      let withAccidental =
        nextLetterValue + ACCIDENTAL_VALUES.get(accidental as Accidental)!;
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
    throw new ImpossibleQualityError("No accidental matches this interval!");
  }

  /**
   * Returns the interval between the current note and `rhs`
   * @param rhs the note to be compared
   * @remarks intervals cannot be negative now, users should decide which note should be `this` or `rhs`
   * @returns an interval between the two notes
   * @throws NotSameTypeError if the input notes do not have the same type
   */
  getIntervalBetween(rhs: Note): Interval {
    if (!Note.isAllTheSameType(this, rhs)) {
      throw new NotSameTypeError();
    }
    let relativeSize =
      DEGREE_VALUES.get(rhs.pitch)! - DEGREE_VALUES.get(this.pitch)! + 1;
    // sometimes this.pitch may be larger than rhs.pitch
    if (relativeSize <= 0) {
      relativeSize += 7;
    }
    let octaves = 0; // relative notes do not have octaves
    if (this.octave !== null && rhs.octave !== null) {
      octaves = Math.floor(
        Math.abs(this.difference(rhs)) / Note.POSITIONS_PER_OCTAVE
      );
    }
    // very messy logic
    let size;
    if (octaves < 1) {
      size = relativeSize;
    } else if (octaves === 1) {
      size = 8 + relativeSize - 1;
    } else {
      size = 8 + (octaves - 1) * 7 + (relativeSize - 1);
    }
    const diff = Math.abs(this.difference(rhs));

    // it currently guesses which accidental it should be... :(
    if (!Interval.checkIsPerfectInterval(size)) {
      for (const quality of ["M", "m", "A", "d"]) {
        const value = new Interval(`${quality}${size}`);
        if (diff === +value) {
          return value;
        }
      }
    } else {
      for (const quality of ["P", "d", "A"]) {
        const value = new Interval(`${quality}${size}`);
        if (diff === +value) {
          return value;
        }
      }
    }

    throw new ImpossibleQualityError(
      `This perfect interval is too wide, no quality can match it. Use enharmonic intervals instead. (Hint: ${rhs.toString()}`
    );
  }

  /**
   * Check if two notes are equal.
   *
   *  Two notes are said to be equal if they have:
   *  - the same pitch
   *  - the same octave (or same type)
   *  - the same quality
   *  if `enharmonicallyEquivalent` is not set to true.
   *  If `enharmonicallyEquivalent` is set to true, then two notes are considered true if they sound the same (that is, the position of them is identical)
   * @param rhs another note to compare
   * @param enharmonicallyEquivalent return the same if the two notes sound the same
   * @returns true if they are equal, false otherwise
   */
  equals(rhs: Note, enharmonicallyEquivalent = false) {
    if (enharmonicallyEquivalent) {
      return this.value === rhs.value;
    } else {
      return (
        this.pitch === rhs.pitch &&
        this.octave === rhs.octave &&
        this.accidental === rhs.accidental
      );
    }
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
