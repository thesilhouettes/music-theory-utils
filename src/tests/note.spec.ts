import { Interval } from "../types/Interval";
import { Note } from "../types/Note";

describe("Note type", () => {
  describe("constrcutor", () => {
    test("works for normal circumstances", function () {
      expect(new Note("C", "#").value).toEqual(1);
      expect(new Note("G", "b").value).toEqual(6);
      expect(new Note("D", "x").value).toEqual(4);
      expect(new Note("A", "bb").value).toEqual(7);
    });

    test("loops around after B", function () {
      expect(new Note("B", "x").value).toEqual(1);
      expect(new Note("B", "#").value).toEqual(0);
    });

    test("loops around below C", function () {
      expect(new Note("C", "bb").value).toEqual(10);
      expect(new Note("C", "b").value).toEqual(11);
    });
  });

  describe("toString", function () {
    test("doesn't output the octave if it is relative", function () {
      expect(new Note("A", "#").toString()).toEqual("A#");
      expect(new Note("A").toString()).toEqual("A");
    });

    test("full output", function () {
      expect(new Note("C", "bb", 5).toString()).toEqual("Cbb5");
      expect(new Note("A", "", 7).toString()).toEqual("A7");
    });
  });

  describe("isAllTheSameType", () => {
    test("should give true for no elements", function () {
      expect(Note.isAllTheSameType()).toBe(true);
    });

    test("should give true if all are really the same type", function () {
      // relative
      expect(Note.isAllTheSameType(new Note("A"), new Note("A"))).toBe(true);
      // absolute
      expect(
        Note.isAllTheSameType(new Note("A", "", 4), new Note("A", "", 5))
      ).toBe(true);
    });

    test("should give false if they are different", function () {
      expect(
        Note.isAllTheSameType(new Note("A", "", 4), new Note("A", ""))
      ).toBe(false);
    });
  });

  describe("add letters", () => {
    test("simple positive intervals", () => {
      expect(Note.addLetter("A", 2)).toEqual("B");
      expect(Note.addLetter("C", 5)).toEqual("G");
    });

    test("compund positive intervals", () => {
      expect(Note.addLetter("A", 9)).toEqual("B");
      expect(Note.addLetter("C", 13)).toEqual("A");
      expect(Note.addLetter("D", 18)).toEqual("G");
    });

    test("simple negative intervals", () => {
      expect(Note.addLetter("A", -2)).toEqual("G");
      expect(Note.addLetter("C", -5)).toEqual("F");
    });

    test("compund negative intervals", () => {
      expect(Note.addLetter("A", -9)).toEqual("G");
      expect(Note.addLetter("C", -13)).toEqual("E");
      expect(Note.addLetter("D", -18)).toEqual("A");
    });
  });

  describe("add intervals", () => {
    test("major and minor intervals", function () {
      expect(
        new Note("A").addInterval(new Interval("M3")).equals(new Note("C", "#"))
      ).toBe(true);
      expect(
        new Note("F").addInterval(new Interval("m3")).equals(new Note("A", "b"))
      ).toBe(true);
      expect(
        new Note("A", "b")
          .addInterval(new Interval("m3"))
          .equals(new Note("C", "b"))
      ).toBe(true);
      expect(
        new Note("F", "#").addInterval(new Interval("m3")).equals(new Note("A"))
      ).toBe(true);
    });

    test("perfect intervals", function () {
      expect(
        new Note("C", "#")
          .addInterval(new Interval("P5"))
          .equals(new Note("G", "#"))
      ).toBe(true);
      expect(
        new Note("B", "b")
          .addInterval(new Interval("P4"))
          .equals(new Note("E", "b"))
      ).toBe(true);
    });

    test("diminished and augmented intervals", function () {
      expect(
        new Note("C")
          .addInterval(new Interval("d6"))
          .equals(new Note("A", "bb"))
      ).toBe(true);
      expect(
        new Note("F").addInterval(new Interval("A3")).equals(new Note("A", "#"))
      ).toBe(true);
    });
  });
});
