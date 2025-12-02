<p align="center">
  <a href="https://silentium-lab.github.io/silentium/#/en/" target="_blank" rel="noopener noreferrer" style="display:flex">
      <img width="180" src="https://silentium-lab.github.io/silentium/assets/img/logo.svg" alt="logo">
  </a>
</p>
<h1 align="center">Silentium</h1>
<br/>
<p align="center">
  <a href="https://npmjs.com/package/silentium"><img src="https://img.shields.io/npm/v/silentium.svg" alt="npm package"></a>
  <a href="https://github.com/silentium-lab/silentium/actions/workflows/node.js.yml"><img src="https://github.com/silentium-lab/silentium/actions/workflows/node.js.yml/badge.svg?branch=main" alt="build status"></a>
</p>
<br/>

Silentium is a TypeScript library for reactive messaging and data flow composition. It provides functional operators for transforming and chaining message streams.

## Examples

```typescript
import { Applied, Stream, Map } from 'silentium';

// Apply a function to a value
Applied(2, (x) => x * 2).then((result) => console.log(result)); // 4

// Convert array to stream and apply function
Applied(Stream([1, 2, 3, 4, 5]), String).then((result) => console.log(result)); // '1','2','3','4','5'

// Map values in a stream
Applied(Map([1, 2, 3], (x) => x * 2), String).then((result) => console.log(result)); // '2','4','6'
```

## Packages

List of packages based on silentium library:
- [Silentium Components](https://github.com/silentium-lab/silentium-components)
- [Silentium Validation](https://github.com/silentium-lab/silentium-validation)
- [Silentium Web API](https://github.com/silentium-lab/silentium-web-api)
- [Silentium Education](https://github.com/silentium-lab/silentium-education)

## License

MIT
