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
      // sounds like B major but wtesth style
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

    test("should work for fully diminshed chords", function () {
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

    test("should work for half diminshed chords", function () {
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
  });
});
