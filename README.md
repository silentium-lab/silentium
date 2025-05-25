<p align="center">
  <a href="https://silentium-lab.github.io/silentium/#/en/" target="_blank" rel="noopener noreferrer">
    <img width="180" src="https://silentium-lab.github.io/silentium/assets/img/logo.svg" alt="logo">
  </a>
</p>
<br/>
<p align="center">
  <a href="https://npmjs.com/package/silentium"><img src="https://img.shields.io/npm/v/silentium.svg" alt="npm package"></a>
  <a href="https://github.com/silentium-lab/silentium/actions/workflows/node.js.yml"><img src="https://github.com/silentium-lab/silentium/actions/workflows/node.js.yml/badge.svg?branch=main" alt="build status"></a>
</p>
<br/>

# Silentium

[Documentation](https://silentium-lab.github.io/silentium/#/en/)

To install the library you can use the command.

```bash
npm install silentium
```

The library helps you create abstractions for information in your system. Instead of working with data abstractions and operations abstractions, you can combine them into a common information abstraction. The approach in which we combine data and operations under information abstractions is object-oriented programming.

The idea for the project was born from the ideas of eolang and was inspired by this paper, 𝜑-calculus:
https://arxiv.org/pdf/2111.13384

## Difference from eolang

Unlike eolang, where the program starts working at the moment when some method receives data, which is called dataization, Silentium starts executing the program at the moment when a guest comes to the information source, requesting data, this difference allows the Silentium library to work on top of JavaScript events, creating abstractions of information around some event models.

## Is silentium reactive?

Silentium is not a reactive programming library, chains of objects only interact with each other through message passing, but due to the fact that Silentium is developed with the idea of ​​working on top of events, it allows for easy integration with any reactive library or framework, transferring event sources to the reactive mechanisms of the required frameworks.
