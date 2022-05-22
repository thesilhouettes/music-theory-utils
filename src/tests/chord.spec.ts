import { Note } from "../types/Note";
import { Chord } from "../types/Chord";
import { Interval } from "../types/Interval";
import { InvalidInputError } from "../types/errorTypes";

describe("Chord", () => {
  describe("constructor", () => {
    test("should throw error if there are no intervals", function () {
      expect(() => new Chord(new Note("E"), [])).toThrowError(
        InvalidInputError
      );
    });
  });

  describe("toString", () => {
    test("major triad and major seventh", function () {
      let majorChord = new Chord(new Note("C"), Chord.majorTriad);
      expect(majorChord.toString()).toEqual("C E G");
      majorChord = new Chord(new Note("B", "b"), Chord.majorTriad);
      expect(majorChord.toString()).toEqual("Bb D F");
      majorChord = new Chord(new Note("F", "#"), Chord.majorSeventh);
      expect(majorChord.toString()).toEqual("F# A# C# E#");
      majorChord = new Chord(new Note("B"), Chord.majorSeventh);
      expect(majorChord.toString()).toEqual("B D# F# A#");
    });

    test("minor triad and minor seventh", function () {
      let minorChord = new Chord(new Note("A", "b"), Chord.minorTriad);
      expect(minorChord.toString()).toEqual("Ab Cb Eb");
      minorChord = new Chord(new Note("D"), Chord.minorTriad);
      expect(minorChord.toString()).toEqual("D F A");
      minorChord = new Chord(new Note("E", "b"), Chord.minorSeventh);
      expect(minorChord.toString()).toEqual("Eb Gb Bb Db");
      // sounds like B major but with style
      minorChord = new Chord(new Note("C", "b"), Chord.minorSeventh);
      expect(minorChord.toString()).toEqual("Cb Ebb Gb Bbb");
    });

    test("should work for dominant chords", function () {
      let dominantChord = new Chord(new Note("B"), Chord.dominantSeventh);
      expect(dominantChord.toString()).toEqual("B D# F# A");
      dominantChord = new Chord(new Note("A", "b"), Chord.dominantSeventh);
      expect(dominantChord.toString()).toEqual("Ab C Eb Gb");
      dominantChord = new Chord(new Note("E"), Chord.dominantSeventh);
      expect(dominantChord.toString()).toEqual("E G# B D");
    });

    test("should work for fully diminished chords", function () {
      let diminishedChord = new Chord(
        new Note("F", "#"),
        Chord.diminishedSeventh
      );
      expect(diminishedChord.toString()).toEqual("F# A C Eb");
      diminishedChord = new Chord(new Note("A"), Chord.diminishedSeventh);
      expect(diminishedChord.toString()).toEqual("A C Eb Gb");
      diminishedChord = new Chord(new Note("C", "#"), Chord.diminishedSeventh);
      expect(diminishedChord.toString()).toEqual("C# E G Bb");
      diminishedChord = new Chord(new Note("C", "b"), Chord.diminishedSeventh);
      expect(diminishedChord.toString()).toEqual("Cb Ebb Gbb Bbbb");
    });

    test("should work for half diminished chords", function () {
      let halfDiminishedChord = new Chord(
        new Note("D", ""),
        Chord.halfDiminishedSeventh
      );
      expect(halfDiminishedChord.toString()).toEqual("D F Ab C");
      halfDiminishedChord = new Chord(
        new Note("F", "#"),
        Chord.halfDiminishedSeventh
      );
      expect(halfDiminishedChord.toString()).toEqual("F# A C E");
      halfDiminishedChord = new Chord(
        new Note("G"),
        Chord.halfDiminishedSeventh
      );
      expect(halfDiminishedChord.toString()).toEqual("G Bb Db F");
      halfDiminishedChord = new Chord(
        new Note("D", "#"),
        Chord.halfDiminishedSeventh
      );
      expect(halfDiminishedChord.toString()).toEqual("D# F# A C#");
    });

    test("should work for absolute notes single octave", function () {
      expect(
        new Chord(new Note("C", "", 3), Chord.majorSeventh).toString()
      ).toEqual("C3 E3 G3 B3");
      expect(
        new Chord(new Note("D", "b", 4), Chord.halfDiminishedSeventh).toString()
      ).toEqual("Db4 Fb4 Abb4 Cb5");
    });

    test("should work for absolute notes across octaves", function () {
      expect(
        new Chord(new Note("F", "", 3), Chord.dominantSeventh).toString()
      ).toEqual("F3 A3 C4 Eb4");
      expect(
        new Chord(new Note("A", "b", 4), Chord.majorSeventh).toString()
      ).toEqual("Ab4 C5 Eb5 G5");
      expect(
        new Chord(new Note("B", "b", 1), Chord.diminishedSeventh).toString()
      ).toEqual("Bb1 Db2 Fb2 Abb2");
    });
  });

  describe("equals", function () {
    test("these chords should equal", function () {
      const c1 = new Chord(new Note("E"), Chord.majorTriad);
      const c2 = new Chord(new Note("E"), Chord.majorTriad);
      expect(c1.equals(c2)).toBe(true);
      const c3 = new Chord(new Note("F", "#", 3), Chord.minorSeventh);
      const c4 = new Chord(new Note("F", "#", 3), Chord.minorSeventh);
      expect(c3.equals(c4)).toBe(true);
    });

    test("these chords should not equal", function () {
      const c1 = new Chord(new Note("G"), Chord.minorTriad);
      const c2 = new Chord(new Note("G"), Chord.majorTriad);
      expect(c1.equals(c2)).toBe(false);
      // enharmonic still gives false
      const c3 = new Chord(new Note("C", "#", 3), Chord.minorSeventh);
      const c4 = new Chord(new Note("D", "b", 3), Chord.minorSeventh);
      expect(c3.equals(c4)).toBe(false);
    });

    test("enharmonic chords", function () {
      // const c1 = new Chord(new Note("F", "#"), Chord.minorSeventh);
      // const c2 = new Chord(new Note("G", "b"), Chord.minorSeventh);
      // expect(c1.equals(c2, { enharmonicallyEquivalent: true })).toBe(true);
      const c3 = new Chord(new Note("C", "b", 5), Chord.dominantSeventh);
      const c4 = new Chord(new Note("B", "", 4), Chord.dominantSeventh);
      expect(c3.equals(c4, { enharmonicallyEquivalent: true })).toBe(true);
    });

    test("ignore inversion", function () {
      const c1 = new Chord(new Note("F", "#"), Chord.minorSeventh);
      const c2 = c1.invert(1);
      expect(c1.equals(c2, { ignoreInversion: true })).toBe(true);
      const c3 = new Chord(new Note("C", "b", 5), Chord.dominantSeventh);
      const c4 = c3.invert(3);
      expect(c3.equals(c4, { ignoreInversion: true })).toBe(true);
    });

    test("enharmonic chords + ignore inversion", function () {
      const c1 = new Chord(new Note("F", "#"), Chord.minorSeventh);
      const c2 = new Chord(new Note("G", "b"), Chord.minorSeventh);
      expect(
        c1.equals(c2, { enharmonicallyEquivalent: true, ignoreInversion: true })
      ).toBe(true);
      const c3 = new Chord(new Note("C", "b", 5), Chord.dominantSeventh);
      const c4 = new Chord(new Note("B", "", 4), Chord.dominantSeventh);
      expect(
        c3.equals(c4, { enharmonicallyEquivalent: true, ignoreInversion: true })
      ).toBe(true);
    });
  });

  describe("inverting chords", function () {
    test("should revert to original for generic notes", function () {
      const chord1 = new Chord(new Note("C", "b"), Chord.majorSeventh);
      expect(chord1.invert(4).equals(chord1)).toBe(true);
      const chord2 = new Chord(new Note("G", "#"), [
        ...Chord.majorSeventh,
        new Interval("m3"),
        new Interval("M3"),
        new Interval("m3"),
      ]);
      expect(chord2.invert(7).equals(chord2)).toBe(true);
    });

    test("should have the correct intervals for generic notes", function () {
      const chord1 = new Chord(new Note("C"), Chord.majorSeventh);
      const chord2 = new Chord(new Note("E"), [
        new Interval("m3"),
        new Interval("M3"),
        new Interval("m2"),
      ]);
      expect(chord1.invert(1).equals(chord2)).toBe(true);
      const chord3 = new Chord(new Note("F", "#"), [
        ...Chord.minorSeventh,
        new Interval("M3"),
        new Interval("m3"),
        new Interval("M3"),
      ]);
      const chord4 = new Chord(new Note("C", "#"), [
        new Interval("m3"),
        new Interval("M3"),
        new Interval("m3"),
        new Interval("M3"),
        new Interval("m3"),
        new Interval("m3"),
      ]);
      expect(chord3.invert(2).equals(chord4)).toBe(true);
    });

    test("should raise one octave for absolute notes", function () {
      const chord1 = new Chord(new Note("C", "b", 4), Chord.majorSeventh);
      const chord2 = new Chord(new Note("C", "b", 5), Chord.majorSeventh);
      expect(chord1.invert(4).equals(chord2)).toBe(true);
      const chord3 = new Chord(new Note("G", "#", 1), [
        ...Chord.majorSeventh,
        new Interval("m3"),
        new Interval("M3"),
        new Interval("m3"),
      ]);
      const chord4 = new Chord(new Note("G", "#", 3), [
        ...Chord.majorSeventh,
        new Interval("m3"),
        new Interval("M3"),
        new Interval("m3"),
      ]);
      expect(chord3.invert(7).equals(chord4)).toBe(true);
    });
  });
});
