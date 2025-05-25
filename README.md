# Silentium

To install the library you can use the command.

```bash
npm install silentium
```

The library helps you create abstractions for information in your system. Instead of working with data abstractions and operations abstractions, you can combine them into a common information abstraction. The approach in which we combine data and operations under information abstractions is object-oriented programming.

The idea for the project was born from the ideas of eolang and was inspired by this paper, 𝜑-calculus:
https://arxiv.org/pdf/2111.13384

## Difference from eolang

Unlike eolang, where the program starts working at the moment when some method receives data, which is called dataization, Silentium starts executing the program at the moment when a guest comes to the information source, requesting data, this difference allows the Silentium library to work on top of JavaScript events, creating abstractions of information around some event models.
