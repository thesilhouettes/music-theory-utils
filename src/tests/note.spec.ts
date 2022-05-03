import { expect } from "chai";
import { describe } from "mocha";
import { Interval } from "../types/Interval";
import { Note } from "../types/Note";

describe("Note type", () => {
  describe("constrcutor", () => {
    it("works for normal circumstances", function () {
      expect(new Note("C", "#").value).to.equal(1);
      expect(new Note("G", "b").value).to.equal(6);
      expect(new Note("D", "x").value).to.equal(4);
      expect(new Note("A", "bb").value).to.equal(7);
    });

    it("loops around after B", function () {
      expect(new Note("B", "x").value).to.equal(1);
      expect(new Note("B", "#").value).to.equal(0);
    });

    it("loops around below C", function () {
      expect(new Note("C", "bb").value).to.equal(10);
      expect(new Note("C", "b").value).to.equal(11);
    });
  });

  describe("toString", function () {
    it("doesn't output the octave if it is relative", function () {
      expect(new Note("A", "#").toString()).to.equal("A#");
      expect(new Note("A", "").toString()).to.equal("A");
    });

    it("full output", function () {
      expect(new Note("C", "bb", 5).toString()).to.equal("Cbb5");
      expect(new Note("A", "", 7).toString()).to.equal("A7");
    });
  });

  describe("isAllTheSameType", () => {
    it("should give true for no elements", function () {
      expect(Note.isAllTheSameType()).to.be.true;
    });

    it("should give true if all are really the same type", function () {
      // relative
      expect(Note.isAllTheSameType(new Note("A", ""), new Note("A", ""))).to.be
        .true;
      // absolute
      expect(Note.isAllTheSameType(new Note("A", "", 4), new Note("A", "", 5)))
        .to.be.true;
    });

    it("should give false if they are different", function () {
      expect(Note.isAllTheSameType(new Note("A", "", 4), new Note("A", ""))).to
        .be.false;
    });
  });

  describe("add letters", () => {
    it("simple positive intervals", () => {
      expect(Note.addLetter("A", 2)).to.equal("B");
      expect(Note.addLetter("C", 5)).to.equal("G");
    });

    it("compund positive intervals", () => {
      expect(Note.addLetter("A", 9)).to.equal("B");
      expect(Note.addLetter("C", 13)).to.equal("A");
      expect(Note.addLetter("D", 18)).to.equal("G");
    });

    it("simple negative intervals", () => {
      expect(Note.addLetter("A", -2)).to.equal("G");
      expect(Note.addLetter("C", -5)).to.equal("F");
    });

    it("compund negative intervals", () => {
      expect(Note.addLetter("A", -9)).to.equal("G");
      expect(Note.addLetter("C", -13)).to.equal("E");
      expect(Note.addLetter("D", -18)).to.equal("A");
    });
  });

  describe("add intervals", () => {
    it("major and minor intervals", function () {
      expect(
        new Note("A", "")
          .addInterval(new Interval("M3"))
          .equals(new Note("C", "#"))
      ).to.be.true;
      expect(
        new Note("F", "")
          .addInterval(new Interval("m3"))
          .equals(new Note("A", "b"))
      ).to.be.true;
      expect(
        new Note("A", "b")
          .addInterval(new Interval("m3"))
          .equals(new Note("C", "b"))
      ).to.be.true;
      expect(
        new Note("F", "#")
          .addInterval(new Interval("m3"))
          .equals(new Note("A", ""))
      ).to.be.true;
    });

    it("perfect intervals", function () {
      expect(
        new Note("C", "#")
          .addInterval(new Interval("P5"))
          .equals(new Note("G", "#"))
      ).to;
      expect(
        new Note("B", "b")
          .addInterval(new Interval("P4"))
          .equals(new Note("E", "b"))
      ).to.be.true;
    });

    it("diminished and augmented intervals", function () {
      expect(
        new Note("C", "")
          .addInterval(new Interval("d6"))
          .equals(new Note("A", "bb"))
      ).to.be.true;
      expect(
        new Note("F", "")
          .addInterval(new Interval("A3"))
          .equals(new Note("A", "#"))
      ).to.be.true;
    });
  });
});
