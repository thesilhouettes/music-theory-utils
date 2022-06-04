import { Note } from "./Note";

/**
 * Throw when no interval quality or accidental can match the requirement
 */
export class ImpossibleQualityError extends Error {
  /**
   * TODO: improve the error messages
   * @param msg a generic message describing the error
   */
  constructor(msg: string) {
    super(msg);
  }
}

/**
 * This error will be thrown when the position of a note is out of C0 or C8.
 * May also be thrown by methods which require interval additions.
 */
export class OutOfRegionError extends Error {
  /**
   * Decides the error message based on the input value
   * @param value the value that is out of region
   */
  constructor(value: number) {
    if (value < Note.C0_POSITION) {
      super("This note is lower than C0");
    } else if (value > Note.C8_POSITION) {
      super("This note is higher than C8");
    }
  }
}

/**
 * This error will be thrown when constructors or methods receives invalid inputs.
 */
export class InvalidInputError extends Error {
  /**
   * @param propertyName which property receives invalid input
   * @param explain explain why it is invalid
   */
  constructor(propertyName: string, explain: string) {
    super(`[${propertyName}]: ${explain}`);
  }
}

/**
 * This error will be thrown when users invoke methods with notes that have
 * different types.
 */
export class NotSameTypeError extends Error {
  constructor() {
    super("The notes are not the same type");
  }
}

/**
 * This error will be thrown when a function that works with absolute notes uses generic notes
 */
export class GenericNoteError extends Error {
  constructor() {
    super("This note is not an absolute note!");
  }
}
