import { Interval } from "../types/Interval";

describe("intervals", () => {
  describe("constructor", () => {
    test("split the interval correctly", function () {
      let interval = new Interval("A3");
      expect(interval.number).toEqual(3);
      expect(interval.quality).toEqual("A");
    });

    test("throws an error for splitting errors", function () {
      expect(function () {
        new Interval("");
      }).toThrow();
      expect(function () {
        new Interval("P7");
      }).toThrow();
      expect(function () {
        new Interval("m4");
      }).toThrow();
      expect(function () {
        new Interval("C4");
      }).toThrow();
    });
  });

  describe("toString", function () {
    test("works", () => {
      expect(new Interval("d4").toString()).toEqual("d4");
    });
  });

  describe("isPerfectInterval", () => {
    test("outputs true for perfect intervals", () => {
      expect(new Interval("A5").isPerfectInterval()).toBe(true);
      expect(new Interval("P11").isPerfectInterval()).toBe(true);
    });

    test("outputs false for imperfect intervals", () => {
      expect(new Interval("m3").isPerfectInterval()).toBe(false);
      expect(new Interval("M10").isPerfectInterval()).toBe(false);
    });
  });

  describe("valueOf", () => {
    test("simple intervals", function () {
      expect(new Interval("m3").valueOf()).toEqual(3);
      expect(new Interval("P5").valueOf()).toEqual(7);
    });
    test("compound intervals", function () {
      expect(new Interval("m10").valueOf()).toEqual(15);
      expect(new Interval("P12").valueOf()).toEqual(19);
      expect(new Interval("M17").valueOf()).toEqual(28);
      expect(new Interval("d17").valueOf()).toEqual(26);
      expect(new Interval("P18").valueOf()).toEqual(29);
    });
  });
});
