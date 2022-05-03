import { expect } from "chai";
import { describe } from "mocha";
import { Interval } from "../types/Interval";
import { Note } from "../types/Note";
import { Chord } from "../types/Chord";

describe("Chord", () => {
  describe("toString", () => {
    it("major triad and major seventh", function () {
      let majorChord = new Chord(new Note("C", ""), [
        new Interval("M3"),
        new Interval("m3"),
      ]);
      expect(majorChord.toString()).to.equal("C E G");
      majorChord = new Chord(new Note("B", "b"), [
        new Interval("M3"),
        new Interval("m3"),
      ]);
      expect(majorChord.toString()).to.equal("Bb D F");
      majorChord = new Chord(new Note("F", "#"), [
        new Interval("M3"),
        new Interval("m3"),
        new Interval("M3"),
      ]);
      expect(majorChord.toString()).to.equal("F# A# C# E#");
      majorChord = new Chord(new Note("B", ""), [
        new Interval("M3"),
        new Interval("m3"),
        new Interval("M3"),
      ]);
      expect(majorChord.toString()).to.equal("B D# F# A#");
    });

    it("minor triad and minor seventh", function () {
      let minorChord = new Chord(new Note("A", "b"), [
        new Interval("m3"),
        new Interval("M3"),
      ]);
      expect(minorChord.toString()).to.equal("Ab Cb Eb");
      minorChord = new Chord(new Note("D", ""), [
        new Interval("m3"),
        new Interval("M3"),
      ]);
      expect(minorChord.toString()).to.equal("D F A");
      minorChord = new Chord(new Note("E", "b"), [
        new Interval("m3"),
        new Interval("M3"),
        new Interval("m3"),
      ]);
      expect(minorChord.toString()).to.equal("Eb Gb Bb Db");
      // sounds like B major but with style
      minorChord = new Chord(new Note("C", "b"), [
        new Interval("m3"),
        new Interval("M3"),
        new Interval("m3"),
      ]);
      expect(minorChord.toString()).to.equal("Cb Ebb Gb Bbb");
    });

    it("should work for dominant chords", function () {
      let dominantChord = new Chord(new Note("B", ""), [
        new Interval("M3"),
        new Interval("m3"),
        new Interval("m3"),
      ]);
      expect(dominantChord.toString()).to.equal("B D# F# A");
      dominantChord = new Chord(new Note("A", "b"), [
        new Interval("M3"),
        new Interval("m3"),
        new Interval("m3"),
      ]);
      expect(dominantChord.toString()).to.equal("Ab C Eb Gb");
      dominantChord = new Chord(new Note("E", ""), [
        new Interval("M3"),
        new Interval("m3"),
        new Interval("m3"),
      ]);
      expect(dominantChord.toString()).to.equal("E G# B D");
    });

    // actually diminished chords that require three flats will fail
    // like Cb. The chord becomes Cb Ebb Gbb Bbbb
    // I don't have three flats... :(
    it("should work for fully diminshed chords", function () {
      let diminishedChord = new Chord(new Note("F", "#"), [
        new Interval("m3"),
        new Interval("m3"),
        new Interval("m3"),
      ]);
      expect(diminishedChord.toString()).to.equal("F# A C Eb");
      diminishedChord = new Chord(new Note("A", ""), [
        new Interval("m3"),
        new Interval("m3"),
        new Interval("m3"),
      ]);
      expect(diminishedChord.toString()).to.equal("A C Eb Gb");
      diminishedChord = new Chord(new Note("C", "#"), [
        new Interval("m3"),
        new Interval("m3"),
        new Interval("m3"),
      ]);
      expect(diminishedChord.toString()).to.equal("C# E G Bb");
    });

    it("should work for half diminshed chords", function () {
      let halfDiminishedChord = new Chord(new Note("D", ""), [
        new Interval("m3"),
        new Interval("m3"),
        new Interval("M3"),
      ]);
      expect(halfDiminishedChord.toString()).to.equal("D F Ab C");
      halfDiminishedChord = new Chord(new Note("F", "#"), [
        new Interval("m3"),
        new Interval("m3"),
        new Interval("M3"),
      ]);
      expect(halfDiminishedChord.toString()).to.equal("F# A C E");
      halfDiminishedChord = new Chord(new Note("G", ""), [
        new Interval("m3"),
        new Interval("m3"),
        new Interval("M3"),
      ]);
      expect(halfDiminishedChord.toString()).to.equal("G Bb Db F");
    });
  });
});
