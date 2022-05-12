import { Note } from "../types/Note";
import { Chord } from "../types/Chord";

describe("Chord", () => {
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
      ).toEqual("Db4 Fb4 Abb4 Cb4");
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
});
