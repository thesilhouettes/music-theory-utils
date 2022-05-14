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
