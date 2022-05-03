import { expect } from "chai";
import { describe } from "mocha";
import { Interval } from "../types/Interval";

describe("intervals", () => {
  describe("constructor", () => {
    it("split the interval correctly", function () {
      let interval = new Interval("A3");
      expect(interval.number).to.equal(3);
      expect(interval.quality).to.equal("A");
    });

    it("throws an error for splitting errors", function () {
      expect(function () {
        new Interval("");
      }).to.throw();
      expect(function () {
        new Interval("P7");
      }).to.throw();
      expect(function () {
        new Interval("m4");
      }).to.throw();
      expect(function () {
        new Interval("C4");
      }).to.throw();
    });
  });

  describe("toString", function () {
    it("works", () => {
      expect(new Interval("d4").toString()).to.equal("d4");
    });
  });

  describe("isPerfectInterval", () => {
    it("outputs true for perfect intervals", () => {
      expect(new Interval("A5").isPerfectInterval()).to.be.true;
      expect(new Interval("P11").isPerfectInterval()).to.be.true;
    });

    it("outputs false for imperfect intervals", () => {
      expect(new Interval("m3").isPerfectInterval()).to.be.false;
      expect(new Interval("M10").isPerfectInterval()).to.be.false;
    });
  });

  describe("valueOf", () => {
    it("simple intervals", function () {
      expect(new Interval("m3").valueOf()).to.equal(3);
      expect(new Interval("P5").valueOf()).to.equal(7);
    });
    it("compound intervals", function () {
      expect(new Interval("m10").valueOf()).to.equal(15);
      expect(new Interval("P12").valueOf()).to.equal(19);
      expect(new Interval("M17").valueOf()).to.equal(28);
      expect(new Interval("d17").valueOf()).to.equal(26);
      expect(new Interval("P18").valueOf()).to.equal(29);
    });
  });
});
