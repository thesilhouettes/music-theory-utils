# Music Theory Utilities

This library provides basic utilities for manipulating chords, notes, intervals and scales. Expect bugs since it is in a very early stage of development.

There are no dependencies inside this package.

# Introduction

`Note`, `Chord`, `Interval` and `Scale` are class types that can be instantiated.

Every note has a pitch, and a accidental (can be empty), and an octave. A
special note called relative note does not have an octave. Methods inside `Note`
will work differently for them.

An interval is comprised of a size and a quality. Note that certain sizes are perfect intervals, so the sizes they require a different than those who are imperfect.

A Chord is merely a vertical stack of notes. In this library, a chord is defined by a note and a series of intervals.

A Scale is defined similarly to a Chord.

Read the docs for more details.

# Some Small Examples

## Note

Create a note, and add an interval onto it, returns a new note.

```js
new Note("A", "", 4).addInterval(new Interval("M3")); // Note { pitch: 'C', accidental: '#', octave: 5 }
```

Compares if two notes are enharmonically equal. Since C sharp is the same as D flat, it returns true. For exact equals, omit the second argument.

```js
new Note("C", "#", 3).equals(new Note("D", "b", 3), true); // true
```

Get string representation of a note.

```js
new Note("C", "#", 3).toString(); // C#3
```

## Intervals

Test is minor second is a perfect interval, it should be false.

```js
new Interval("m2").isPerfectInterval(); // false
```

Get the number of semitones of an interval. There are four semitones between a major third, front exclusive and end inclusive.

```js
new Interval("M3").valueOf(); // 4
```

## Chord

Generate a chord if any kind of interval.

```js
const c = new Chord(new Note("F"), [new Interval("M3"), new Interval("m3")]);
/* Chord {
base: Note { pitch: 'F', accidental: '', octave: null },
intervals: [
Interval { quality: 'M', size: 3 },
Interval { quality: 'm', size: 3 }
]
} */
```

Collect the notes of a chord as an array.

```js
const cc = [...c];
/*
[
Note { pitch: 'F', accidental: '', octave: null },
Note { pitch: 'A', accidental: '', octave: null },
Note { pitch: 'C', accidental: '', octave: null }
]
*/
```

The library also provides several interval helpers like minor seventh, major seventh and so on.

```js
new Chord(new Note("A", "b"), Chord.minorSeventh);
/*
Chord {
base: Note { pitch: 'A', accidental: 'b', octave: null },
intervals: [
Interval { quality: 'm', size: 3 },
Interval { quality: 'M', size: 3 },
Interval { quality: 'm', size: 3 }
]
}
*/
```

## Scale

Generate a B dorian scale.

```js
const s = new Scale(new Note("B"), Scale.dorian);
/*
Scale {
root: Note { pitch: 'B', accidental: '', octave: null },
configuration: [
Interval { quality: 'M', size: 2 },
Interval { quality: 'm', size: 2 },
Interval { quality: 'M', size: 2 },
Interval { quality: 'M', size: 2 },
Interval { quality: 'M', size: 2 },
Interval { quality: 'm', size: 2 },
Interval { quality: 'M', size: 2 }
]
}
*/
```

We can also collect scales into a note array.

```js
const ss = [...s];
/*
[
Note { pitch: 'B', accidental: '', octave: null },
Note { pitch: 'C', accidental: '#', octave: null },
Note { pitch: 'D', accidental: '', octave: null },
Note { pitch: 'E', accidental: '', octave: null },
Note { pitch: 'F', accidental: '#', octave: null },
Note { pitch: 'G', accidental: '#', octave: null },
Note { pitch: 'A', accidental: '', octave: null },
Note { pitch: 'B', accidental: '', octave: null }
]
*/
```

# Development

After cloning, install the dev dependencies with:

```sh
npm install
```

Run the tests with:

```sh
npm run test # one time
npm run test:watch # continuously
```

Generate docs and coverage report with:

```sh
npm run doc
npm run test:coverage
```

Build the project with:

```sh
npm run build:ts
npm run watch:ts # continuously rebuild the project
```
