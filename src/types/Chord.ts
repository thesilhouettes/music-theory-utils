import { Interval } from "./Interval";
import { Note } from "./Note";

/**
 * Represents a chord, which means notes are stacked together vertically. In
 * `music-theory-utils`, a chord is represented by a base note, and the
 * intervals.
 *
 * @see {@link Note} and {@link Interval} for details on the base note and interval
 *
 */
export class Chord {
  /**
   * The root of a chord
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
   * Intervals for a major triad
   */
  static majorTriad = [new Interval("M3"), new Interval("m3")];
  /**
   * Intervals for a major seventh
   */
  static majorSeventh = [
    new Interval("M3"),
    new Interval("m3"),
    new Interval("M3"),
  ];
  /**
   * Intervals for a minor triad
   */
  static minorTriad = [new Interval("m3"), new Interval("M3")];
  /**
   * Intervals for a minor seventh
   */
  static minorSeventh = [
    new Interval("m3"),
    new Interval("M3"),
    new Interval("m3"),
  ];
  /**
   * Intervals for a dominant seventh
   */
  static dominantSeventh = [
    new Interval("M3"),
    new Interval("m3"),
    new Interval("m3"),
  ];
  /**
   * Intervals for a diminished triad
   */
  static diminishedTriad = [new Interval("m3"), new Interval("m3")];
  /**
   * Intervals for a diminished seventh
   */
  static diminishedSeventh = [
    new Interval("m3"),
    new Interval("m3"),
    new Interval("m3"),
  ];
  /**
   * Intervals for a half diminished seventh
   */
  static halfDiminishedSeventh = [
    new Interval("m3"),
    new Interval("m3"),
    new Interval("M3"),
  ];

  /**
   * Constructs a chord from the root and the corresponding intervals
   * @param note the root
   * @param intervals the intervals which make up the chord, see the examples below.
   * @example
   * ```ts
   * new Chord(new Note("A"), [new Interval("M3"), new Interval("m3")]);
   * // "A C# E" (A major triad)
   * ```
   * ```ts
   * new Chord(new Note("C", "b"), Chord.minorSeventh);
   * // "Cb Eb Gb Bb"
   * ```
   */
  constructor(note: Note, intervals: Interval[]) {
    this.base = note;
    this.intervals = intervals;
  }

  /**
   * Converts the chord to a string
   * @returns a space separated list of notes
   */
  toString() {
    let acc = this.base + " ";
    let current = this.base;
    for (const interval of this.intervals) {
      current = current.addInterval(interval);
      acc += current + " ";
    }
    return acc.slice(0, -1);
  }
}
