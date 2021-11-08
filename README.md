# lotivis: location time visualization

[![Node.js Test](https://github.com/lukasdanckwerth/lotivis/actions/workflows/npm-test.yml/badge.svg)](https://github.com/lukasdanckwerth/lotivis/actions/workflows/npm-test.yml) [![license](http://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat)](https://github.com/c3js/c3/blob/master/LICENSE) [![](https://data.jsdelivr.com/v1/package/npm/lotivis/badge?style=rounded)](https://www.jsdelivr.com/package/npm/lotivis)

> lotivis.js is a D3-based chart library to visualize location and time specific data.

**lotivis** (or **lotivis.js**) is a JavaScript library for
visualizing location and time specific data using [D3](https://github.com/mbostock/d3).

## Resources

- [Use](#Use)
- [Development](#Development)
- API Reference
- [Releases](https://github.com/lukasdanckwerth/lotivis/releases)
- [Examples](https://lukasdanckwerth.github.io/lotivis/)

## Use

**lotivis.js** is available through jsDelivr.

```html
<!-- lotivis.js stylesheet -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/lotivis@1/dist/lotivis.css"/>

<!-- lotivis.js dependencies and library -->
<script src="https://cdn.jsdelivr.net/npm/d3@6.5.0/dist/d3.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/lotivis@1/dist/lotivis.min.js"></script>
```

If you downloaded and build this project you can find the **lotivis.js** library files in the `dist` directory.

```text
dist/
  |
  |- lotivis.css                   <-- You need these two files
  |- lotivis.js                    <-- in order to use lotivis.
  |- lotivis.js.map
  |- lotivis.tests.js
  |- lotivis.tests.js.map
```

## Development

To start development run:
```bash
// stars rollup with -c -w arguments
$ npm run develop

// starts a http-server serving the examples
$ npm run develop:example

// start developing...


// tests can be run with
$ npm run test
```

## Dependency

+ [D3.js](https://github.com/mbostock/d3) `^5.0.0`

## License

MIT
