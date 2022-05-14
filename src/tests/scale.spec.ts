import { InvalidInputError } from "../types/errorTypes";
import { Interval } from "../types/Interval";
import { Note } from "../types/Note";
import { Scale } from "../types/Scale";

describe("scale", function () {
  describe("constructor", function () {
    test("valid scales", function () {
      expect(new Scale(new Note("A"), [new Interval("M2")])).toEqual({
        root: new Note("A"),
        configuration: [new Interval("M2")],
      });
    });

    test("empty configuration should throw", function () {
      expect(() => new Scale(new Note("F", "#"), [])).toThrowError(
        InvalidInputError
      );
    });
  });

  describe("modes provided by scale", function () {
    test("major", function () {
      expect(new Scale(new Note("A"), Scale.major).toString()).toBe(
        "A B C# D E F# G# A"
      );
      expect(new Scale(new Note("C", "#"), Scale.major).toString()).toBe(
        "C# D# E# F# G# A# B# C#"
      );
    });

    test("dorian", function () {
      expect(new Scale(new Note("B", "b"), Scale.dorian).toString()).toBe(
        "Bb C Db Eb F G Ab Bb"
      );
      expect(new Scale(new Note("F", "#"), Scale.dorian).toString()).toBe(
        "F# G# A B C# D# E F#"
      );
    });

    test("phrygian", function () {
      expect(new Scale(new Note("G", ""), Scale.phrygian).toString()).toBe(
        "G Ab Bb C D Eb F G"
      );
      expect(new Scale(new Note("A", "b"), Scale.phrygian).toString()).toBe(
        "Ab Bbb Cb Db Eb Fb Gb Ab"
      );
    });

    test("lydian", function () {
      expect(new Scale(new Note("E", ""), Scale.lydian).toString()).toBe(
        "E F# G# A# B C# D# E"
      );
      expect(new Scale(new Note("D", "b"), Scale.lydian).toString()).toBe(
        "Db Eb F G Ab Bb C Db"
      );
    });

    test("mixolydian", function () {
      expect(new Scale(new Note("F", ""), Scale.mixolydian).toString()).toBe(
        "F G A Bb C D Eb F"
      );
      expect(new Scale(new Note("C", "#"), Scale.mixolydian).toString()).toBe(
        "C# D# E# F# G# A# B C#"
      );
    });

    test("minor", function () {
      expect(new Scale(new Note("A"), Scale.minor).toString()).toBe(
        "A B C D E F G A"
      );
      expect(new Scale(new Note("C", "#"), Scale.minor).toString()).toBe(
        "C# D# E F# G# A B C#"
      );
    });

    test("locrian", function () {
      expect(new Scale(new Note("C", "b"), Scale.locrian).toString()).toBe(
        "Cb Dbb Ebb Fb Gbb Abb Bbb Cb"
      );
      expect(new Scale(new Note("G", ""), Scale.locrian).toString()).toBe(
        "G Ab Bb C Db Eb F G"
      );
    });
  });

  describe("equals", function () {
    expect(
      new Scale(new Note("E", "b"), Scale.major).equals(
        new Scale(new Note("E", "b"), Scale.major)
      )
    ).toBe(true);
    expect(
      new Scale(new Note("E", "b"), Scale.locrian).equals(
        new Scale(new Note("E", "b"), Scale.minor)
      )
    ).toBe(false);
    expect(
      new Scale(new Note("F", "b"), Scale.minor).equals(
        new Scale(new Note("E", ""), Scale.minor)
      )
    ).toBe(false);
  });
});
