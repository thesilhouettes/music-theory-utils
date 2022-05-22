import {
  ImpossibleQualityError,
  InvalidInputError,
  NotSameTypeError,
  OutOfRegionError,
} from "../types/errorTypes";
import { Interval } from "../types/Interval";
import { Note } from "../types/Note";

describe("Note type", () => {
  describe("from", function () {
    test("check without octaves", function () {
      expect(Note.from("C#")).toEqual(new Note("C", "#"));
      expect(Note.from("Cx")).toEqual(new Note("C", "x"));
      expect(Note.from("Gbb")).toEqual(new Note("G", "bb"));
      expect(Note.from("Abbb")).toEqual(new Note("A", "bbb"));
      expect(Note.from("B#x")).toEqual(new Note("B", "#x"));
      expect(Note.from("E")).toEqual(new Note("E", ""));
    });

    test("check with octaves", function () {
      expect(Note.from("A0")).toEqual(new Note("A", "", 0));
      expect(Note.from("Cx1")).toEqual(new Note("C", "x", 1));
      expect(Note.from("Bbb4")).toEqual(new Note("B", "bb", 4));
      expect(Note.from("Ebbb7")).toEqual(new Note("E", "bbb", 7));
      expect(Note.from("F#x5")).toEqual(new Note("F", "#x", 5));
      expect(Note.from("E3")).toEqual(new Note("E", "", 3));
    });

    test("invalid note names", function () {
      expect(() => Note.from("H#x5")).toThrowError(InvalidInputError);
      expect(() => Note.from("I3")).toThrowError(InvalidInputError);
    });

    test("invalid accidentals names", function () {
      expect(() => Note.from("Abbbbb5")).toThrowError(InvalidInputError);
      expect(() => Note.from("C#x##4")).toThrowError(InvalidInputError);
    });

    test("invalid octaves", function () {
      expect(() => Note.from("Abb9")).toThrowError(InvalidInputError);
      expect(() => Note.from("C-3")).toThrowError(InvalidInputError);
    });
  });

  describe("constructor and value", () => {
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

    test("absolute notes", function () {
      expect(new Note("C", "", 1).value).toEqual(3);
      expect(new Note("D", "#", 2).value).toEqual(18);
      expect(new Note("E", "b", 4).value).toEqual(42);
      expect(new Note("G", "bb", 5).value).toEqual(56);
      expect(new Note("B", "b", 7).value).toEqual(85); // it is one lower than the highest note
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
      expect(
        Note.isAllTheSameType(new Note("A", ""), new Note("A", "", 5))
      ).toBe(false);
    });
  });

  describe("add letters", () => {
    test("simple positive intervals", () => {
      expect(Note.addLetter("A", 2)).toEqual("B");
      expect(Note.addLetter("C", 5)).toEqual("G");
    });

    test("compound positive intervals", () => {
      expect(Note.addLetter("A", 9)).toEqual("B");
      expect(Note.addLetter("C", 13)).toEqual("A");
      expect(Note.addLetter("D", 18)).toEqual("G");
    });

    test("simple negative intervals", () => {
      expect(Note.addLetter("A", -2)).toEqual("G");
      expect(Note.addLetter("C", -5)).toEqual("F");
    });

    test("compound negative intervals", () => {
      expect(Note.addLetter("A", -9)).toEqual("G");
      expect(Note.addLetter("C", -13)).toEqual("E");
      expect(Note.addLetter("D", -18)).toEqual("A");
    });

    test("should return the same note", () => {
      expect(Note.addLetter("A", 1)).toEqual("A");
      expect(Note.addLetter("D", 1)).toEqual("D");
    });

    test("should throw error for 0 and non-integers", () => {
      expect(() => Note.addLetter("B", 0)).toThrowError(InvalidInputError);
      expect(() => Note.addLetter("B", -1.2)).toThrowError(InvalidInputError);
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

    test("absolute notes same octave", function () {
      expect(new Note("E", "b", 2).addInterval(new Interval("m3"))).toEqual(
        new Note("G", "b", 2)
      );
      expect(new Note("G", "#", 3).addInterval(new Interval("M2"))).toEqual(
        new Note("A", "#", 3)
      );
      expect(new Note("G", "", 3).addInterval(new Interval("A2"))).toEqual(
        new Note("A", "#", 3)
      );
      expect(new Note("F", "", 3).addInterval(new Interval("d3"))).toEqual(
        new Note("A", "bb", 3)
      );
    });

    test("absolute notes between two octaves", function () {
      expect(new Note("A", "", 2).addInterval(new Interval("m3"))).toEqual(
        new Note("C", "", 3)
      );
      expect(new Note("E", "#", 3).addInterval(new Interval("M6"))).toEqual(
        new Note("C", "x", 4)
      );
      expect(new Note("D", "", 3).addInterval(new Interval("M7"))).toEqual(
        new Note("C", "#", 4)
      );
      expect(new Note("E", "b", 5).addInterval(new Interval("A6"))).toEqual(
        new Note("C", "#", 6)
      );
      expect(new Note("G", "#", 2).addInterval(new Interval("M3"))).toEqual(
        new Note("B", "#", 2)
      );
    });

    test("absolute notes compound intervals", function () {
      expect(new Note("A", "", 3).addInterval(new Interval("m10"))).toEqual(
        new Note("C", "", 5)
      );
      expect(new Note("E", "", 2).addInterval(new Interval("P12"))).toEqual(
        new Note("B", "", 3)
      );
      expect(new Note("D", "", 3).addInterval(new Interval("A8"))).toEqual(
        new Note("D", "#", 4)
      );
      expect(new Note("E", "b", 5).addInterval(new Interval("d10"))).toEqual(
        new Note("G", "bb", 6)
      );
    });

    test("should fail", function () {
      // not practical
      expect(() =>
        new Note("B", "bbb").addInterval(new Interval("d2"))
      ).toThrowError(ImpossibleQualityError);
    });
  });

  describe("difference", function () {
    test("relative intervals", function () {
      expect(new Note("C").difference(new Note("A"))).toEqual(9);
      expect(new Note("G", "b").difference(new Note("A", "b"))).toEqual(2);
    });
    test("relative intervals negative side", function () {
      expect(new Note("F", "#").difference(new Note("C"))).toEqual(-6);
      expect(new Note("B", "b").difference(new Note("D", "#"))).toEqual(-5);
    });
    test("absolute intervals, simple intervals", function () {
      expect(new Note("C", "", 4).difference(new Note("E", "", 4))).toEqual(4);
      expect(new Note("D", "b", 6).difference(new Note("A", "#", 6))).toEqual(
        9
      );
    });
    test("absolute intervals, compound intervals", function () {
      expect(new Note("C", "", 3).difference(new Note("E", "", 4))).toEqual(16);
      expect(new Note("D", "b", 2).difference(new Note("A", "#", 6))).toEqual(
        57
      );
    });
    test("absolute intervals, negative side simple intervals", function () {
      expect(new Note("D", "", 4).difference(new Note("F", "", 3))).toEqual(-9);
      expect(new Note("F", "b", 6).difference(new Note("A", "", 5))).toEqual(
        -7
      );
    });
    test("absolute intervals, negative side compound intervals", function () {
      expect(new Note("D", "", 4).difference(new Note("F", "", 2))).toEqual(
        -21
      );
      expect(new Note("F", "", 7).difference(new Note("A", "bb", 5))).toEqual(
        -22
      );
    });
    test("two notes of different types should throw error", function () {
      expect(() =>
        new Note("D", "#", 4).difference(new Note("F", "#"))
      ).toThrowError(NotSameTypeError);
      expect(() =>
        new Note("C", "b").difference(new Note("A", "bb", 5))
      ).toThrowError(NotSameTypeError);
    });
  });

  describe("from absolute position", function () {
    test("no accidentals", function () {
      expect(Note.fromAbsolutePosition(39)).toEqual(new Note("C", "", 4));
      expect(Note.fromAbsolutePosition(77)).toEqual(new Note("D", "", 7));
      expect(Note.fromAbsolutePosition(24)).toEqual(new Note("A", "", 2));
    });

    test("with accidentals", function () {
      expect(Note.fromAbsolutePosition(39, "bb")).toEqual(
        new Note("D", "bb", 4)
      );
      expect(Note.fromAbsolutePosition(76, "#")).toEqual(new Note("C", "#", 7));
      expect(Note.fromAbsolutePosition(24, "x")).toEqual(new Note("G", "x", 2));
      expect(Note.fromAbsolutePosition(4, "b")).toEqual(new Note("D", "b", 1));
      expect(Note.fromAbsolutePosition(10, "bb")).toEqual(
        new Note("A", "bb", 1)
      );
      expect(Note.fromAbsolutePosition(16, "x")).toEqual(new Note("B", "x", 1));
    });

    test("throw error is not possible", function () {
      expect(() => Note.fromAbsolutePosition(1, "")).toThrowError(
        ImpossibleQualityError
      );
      expect(() => Note.fromAbsolutePosition(53, "b")).toThrowError(
        ImpossibleQualityError
      );
    });

    test("throw error is out of range", function () {
      expect(() => Note.fromAbsolutePosition(12519350, "")).toThrowError(
        OutOfRegionError
      );
      expect(() => Note.fromAbsolutePosition(-12519350, "")).toThrowError(
        OutOfRegionError
      );
      expect(() => Note.fromAbsolutePosition(23.35, "")).toThrowError(
        InvalidInputError
      );
    });
  });

  describe("get intervals between", function () {
    test("throw errors when notes are not the same type", function () {
      expect(() =>
        new Note("A").getIntervalBetween(new Note("B", "#", 3))
      ).toThrowError(NotSameTypeError);
    });

    test("throw errors when there is no range suitable", function () {
      expect(() =>
        new Note("A", "bb", 2).getIntervalBetween(new Note("B", "x", 3))
      ).toThrowError(ImpossibleQualityError);
    });

    test("relative intervals not perfect", function () {
      expect(new Note("A").getIntervalBetween(new Note("F", "#"))).toEqual(
        new Interval("M6")
      );
      expect(new Note("A").getIntervalBetween(new Note("F", ""))).toEqual(
        new Interval("m6")
      );
      expect(new Note("E", "#").getIntervalBetween(new Note("G", ""))).toEqual(
        new Interval("d3")
      );
      expect(new Note("E", "b").getIntervalBetween(new Note("G", "#"))).toEqual(
        new Interval("A3")
      );
    });

    test("relative intervals perfect", function () {
      expect(new Note("B", "b").getIntervalBetween(new Note("F", "b"))).toEqual(
        new Interval("d5")
      );
      expect(new Note("C", "").getIntervalBetween(new Note("G", ""))).toEqual(
        new Interval("P5")
      );
      expect(new Note("D", "").getIntervalBetween(new Note("A", "#"))).toEqual(
        new Interval("A5")
      );
    });

    test("absolute intervals single octave not perfect", function () {
      expect(
        new Note("F", "#", 4).getIntervalBetween(new Note("E", "#", 5))
      ).toEqual(new Interval("M7"));
      expect(
        new Note("A", "", 3).getIntervalBetween(new Note("F", "", 4))
      ).toEqual(new Interval("m6"));
      expect(
        new Note("E", "#", 6).getIntervalBetween(new Note("G", "", 6))
      ).toEqual(new Interval("d3"));
      expect(
        new Note("E", "b", 2).getIntervalBetween(new Note("G", "#", 2))
      ).toEqual(new Interval("A3"));
    });

    test("absolute intervals single octave perfect", function () {
      expect(
        new Note("F", "#", 4).getIntervalBetween(new Note("C", "#", 5))
      ).toEqual(new Interval("P5"));
      expect(
        new Note("A", "", 3).getIntervalBetween(new Note("D", "b", 4))
      ).toEqual(new Interval("d4"));
      expect(
        new Note("E", "#", 6).getIntervalBetween(new Note("E", "#", 6))
      ).toEqual(new Interval("P1"));
      expect(
        new Note("E", "b", 2).getIntervalBetween(new Note("A", "", 2))
      ).toEqual(new Interval("A4"));
      expect(
        new Note("D", "x", 2).getIntervalBetween(new Note("D", "x", 3))
      ).toEqual(new Interval("P8"));
    });

    test("absolute intervals more octaves not perfect", function () {
      expect(
        new Note("F", "#", 4).getIntervalBetween(new Note("G", "#", 6))
      ).toEqual(new Interval("M16"));
      expect(
        new Note("A", "", 3).getIntervalBetween(new Note("F", "", 5))
      ).toEqual(new Interval("m13"));
      expect(
        new Note("E", "#", 3).getIntervalBetween(new Note("G", "", 6))
      ).toEqual(new Interval("d24"));
      expect(
        new Note("E", "b", 2).getIntervalBetween(new Note("G", "#", 5))
      ).toEqual(new Interval("A24"));
    });

    test("absolute intervals more octaves not perfect", function () {
      expect(
        new Note("F", "#", 4).getIntervalBetween(new Note("B", "", 5))
      ).toEqual(new Interval("P11"));
      expect(
        new Note("A", "b", 3).getIntervalBetween(new Note("E", "", 5))
      ).toEqual(new Interval("A12"));
      expect(
        new Note("E", "b", 3).getIntervalBetween(new Note("A", "bb", 6))
      ).toEqual(new Interval("d25"));
      expect(
        new Note("B", "", 2).getIntervalBetween(new Note("B", "", 5))
      ).toEqual(new Interval("P22"));
    });
  });

  describe("enharmonic equal", function () {
    expect(new Note("A", "", 3).equals(new Note("B", "bb", 3), true)).toBe(
      true
    );
    expect(new Note("A", "").equals(new Note("B", "bb"), true)).toBe(true);
  });
});
