import { InvalidInputError } from "./errorTypes";
import { Interval } from "./Interval";
import { Note } from "./Note";

/**
 * This encapsulates the options of Chord `equals`.
 */
export interface EqualOptions {
  /**
   *  A chord is considered equal if they sound the same
   */
  enharmonicallyEquivalent?: boolean;
  /**
   * A chord is considered equal if they have the same notes
   */
  ignoreInversion?: boolean;
}

/**
 * Represents a chord, which means notes are stacked together vertically. In
 * `music-theory-utils`, a chord is represented by a base note, and the
 * intervals.
 *
 * @see {@link Note} and {@link Interval} for details on the base note and interval
 *
 */
export class Chord implements Iterable<Note> {
  /**
   * The root of a chord.
   */
  base: Note;
  /**
   * An array of intervals, they are used to calculate the distances
   * between the previous note and the next note.
   * @see {@link Chord.constructor}
   */
  intervals: Interval[];

  // below are some common chords

  /**
   * Intervals for a major triad.
   */
  static majorTriad = [new Interval("M3"), new Interval("m3")];
  /**
   * Intervals for a major seventh.
   */
  static majorSeventh = [
    new Interval("M3"),
    new Interval("m3"),
    new Interval("M3"),
  ];
  /**
   * Intervals for a minor triad.
   */
  static minorTriad = [new Interval("m3"), new Interval("M3")];
  /**
   * Intervals for a minor seventh.
   */
  static minorSeventh = [
    new Interval("m3"),
    new Interval("M3"),
    new Interval("m3"),
  ];
  /**
   * Intervals for a dominant seventh.
   */
  static dominantSeventh = [
    new Interval("M3"),
    new Interval("m3"),
    new Interval("m3"),
  ];
  /**
   * Intervals for a diminished triad.
   */
  static diminishedTriad = [new Interval("m3"), new Interval("m3")];
  /**
   * Intervals for a diminished seventh.
   */
  static diminishedSeventh = [
    new Interval("m3"),
    new Interval("m3"),
    new Interval("m3"),
  ];
  /**
   * Intervals for a half diminished seventh.
   */
  static halfDiminishedSeventh = [
    new Interval("m3"),
    new Interval("m3"),
    new Interval("M3"),
  ];

  /* Short Names */

  static maj = Chord.majorTriad;
  static min = Chord.minorTriad;
  static dim = Chord.diminishedTriad;
  static maj7 = Chord.majorSeventh;
  static min7 = Chord.minorSeventh;
  static dom7 = Chord.dominantSeventh;
  static dim7 = Chord.diminishedSeventh;
  static half7 = Chord.halfDiminishedSeventh;

  /**
   * A map of common chord names
   */
  static COMMON_CHORDS_LONG_NAMES = {
    "major triad": [Chord.maj],
    "minor triad": [Chord.min],
    "diminished triad": [Chord.dim],
    "major seventh": [Chord.maj7],
    "minor seventh": [Chord.min7],
    "dominant seventh": [Chord.dom7],
    "diminished seventh": [Chord.dim7],
    "half-diminished seventh": [Chord.half7],
  };

  static COMMON_CHORDS_SHORT_NAMES = {
    maj: [Chord.maj],
    min: [Chord.min],
    dim: [Chord.dim],
    maj7: [Chord.maj7],
    min7: [Chord.min7],
    dom7: [Chord.dom7],
    dim7: [Chord.dim7],
    half7: [Chord.half7],
  };

  /**
   * Constructs a chord from the root and the corresponding intervals.
   * @param note the root
   * @param intervals the intervals which make up the chord, see the examples below.
   * @example
   * ```ts
   * new Chord(new Note("A"), [new Interval("M3"), new Interval("m3")]);
   * // "A C# E" (A major triad)
   * ```
   * ```ts
   * new Chord(new Note("C", "b"), Chord.minorSeventh);
   * // "Cb Ebb Gb Bbb"
   * ```
   */
  constructor(note: Note, intervals: Interval[]) {
    this.base = note;
    if (intervals.length === 0) {
      throw new InvalidInputError(
        "intervals",
        "A chord must have at least two notes!"
      );
    }
    this.intervals = intervals;
  }

  /**
   * An iterator will return the notes of the chord one by one
   */
  [Symbol.iterator](): Iterator<Note> {
    // currentNote is always ONE NOTE ahead of lastNote
    // each time the next method only returns the lastNote
    // this makes sure the base notes will also be returned
    let currentNote = this.base;
    let lastNote = this.base;
    let index = 0;
    const intervals = this.intervals;
    return {
      next() {
        // by this point we have exhausted all the intervals already
        // so we return return the currentNote
        if (index === intervals.length) {
          // increase index still so the else if statement below can be reached
          index++;
          return {
            value: currentNote,
            done: false,
          };
        }
        // end the iteration by this object
        else if (index > intervals.length) {
          return {
            value: undefined,
            done: true,
          };
        }
        // see the comment above
        lastNote = currentNote;
        currentNote = lastNote.addInterval(intervals[index++]);
        return {
          value: lastNote,
          done: false,
        };
      },
    };
  }

  /**
   * Converts the chord to a string.
   * @returns a space separated list of notes
   */
  toString() {
    let acc = "";
    for (const note of this) {
      acc += note + " ";
    }
    return acc.slice(0, -1);
  }

  /**
   * Inverts a chord several times.
   * @param times how many times to invert the chord.
   * @returns the inverted chord, the original chord is not mutated.
   */
  invert(times: number) {
    const notes = [...this];
    for (let i = 0; i < times; i++) {
      const note = notes.shift()!;
      // example: C2 E2 G2 B2 -> E2 G2 B2 C3 so we should increase the octave of C
      if (note.octave) {
        const diff = notes[notes.length - 1].difference(note);
        if (diff < 0) {
          note.octave! += Math.ceil(-diff / Note.POSITIONS_PER_OCTAVE);
        }
      }
      notes.push(note);
    }
    const intervals = [];
    for (let i = 1; i < notes.length; i++) {
      intervals.push(notes[i - 1].getIntervalBetween(notes[i]));
    }
    return new Chord(notes[0], intervals);
  }

  /**
   * Determine if two chords are equal. The chords should have the same base
   * note and intervals.
   * @param rhs the chord to be compared
   * @param equalOptions modify the behaviour of the equal function
   * @returns a boolean indicating the result
   */
  equals(
    rhs: Chord,
    { enharmonicallyEquivalent: h, ignoreInversion: i }: EqualOptions = {
      enharmonicallyEquivalent: false,
      ignoreInversion: false,
    }
  ) {
    function generateKey(note: Note) {
      return h ? note.value : note.toString();
    }

    if (!i) {
      if (!this.base.equals(rhs.base, h)) return false;
      for (let i = 0; i < this.intervals.length; i++) {
        if (!this.intervals[i].equals(rhs.intervals[i], h)) {
          return false;
        }
      }
      return true;
    } else {
      const thisChord = [...this].map((note) => {
        note.octave = null;
        return note;
      });
      const rhsChord = [...rhs].map((note) => {
        note.octave = null;
        return note;
      });
      const map = new Map();
      thisChord.forEach((note) => map.set(generateKey(note), false));
      const allFine = rhsChord.every((note) => {
        const key = generateKey(note);
        if (map.has(key)) {
          map.set(key, true);
          return true;
        } else {
          return false;
        }
      });
      if (!allFine) {
        return false;
      } else {
        return [...map.entries()].every(([_, val]) => val);
      }
    }
  }
}
