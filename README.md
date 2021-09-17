# lotivis: location time visualization

[![Node.js Test](https://github.com/lukasdanckwerth/lotivis/actions/workflows/npm-test.yml/badge.svg)](https://github.com/lukasdanckwerth/lotivis/actions/workflows/npm-test.yml) [![license](http://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat)](https://github.com/c3js/c3/blob/master/LICENSE) [![](https://data.jsdelivr.com/v1/package/npm/lotivis/badge?style=rounded)](https://www.jsdelivr.com/package/npm/lotivis)

> lotivis.js is a D3-based chart library to visualize location and time specific data.

**lotivis** (or **lotivis.js**) is a JavaScript library for
visualizing location and time specific data using [D3](https://github.com/mbostock/d3).

## Resources

- [Use lotivis](#Use)
- [Develope lotivis](#Development)
- [API Reference](#Development)
- [Releases](https://github.com/lukasdanckwerth/lotivis/releases)
- [Examples](https://github.com/lukasdanckwerth/lotivis/releases)

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

```
dist/
  |
  |- lotivis.css                   <-- You need these two files
  |- lotivis.js                    <-- in order to use lotivis.
  |- lotivis.js.map
  |- lotivis.tests.js
  |- lotivis.tests.js.map
```

## Development

You can run these examples as:
```bash
// build lotivis library
$ npm run build

// run server
$ npm run serve:example
```

## Dependency

+ [D3.js](https://github.com/mbostock/d3) `^5.0.0`

## License

MIT
