# lotivis: location time visualization

**lotivis** (or **lotivis.js**) is a JavaScript library for visualizing location and time specific data using [D3](https://github.com/d3/d3).

## Resources

- [Use](#Use)
- [Development](#Development)
- API Reference
- [Releases](https://github.com/lotivis/lotivis/releases)
<!-- - [Examples](https://lukasdanckwerth.github.io/lotivis/) -->

## Installing

If you use npm, `npm install lotivis`. You can also download the [latest release on GitHub](https://github.com/lotivis/lotivis/releases/latest). For vanilla HTML in modern browsers, import lotivis from Skypack:

```html
<script type="module">

import * as lotivis from "https://cdn.skypack.dev/lotivis@1";

const barChart = lotivis.bar();

</script>
```

For legacy environments, you can load lotivis’s UMD bundle from an npm-based CDN such as jsDelivr; a `lotivis` global is exported:

```html
<script src="https://cdn.jsdelivr.net/npm/lotivis@1"></script>
<script>

const barChart = lotivis.bar();

</script>
```

You can also use the standalone lotivis microlibraries. For example, [lotivis-data](https://github.com/lotivis/lotivis-data):

```html
<script type="module">

import { DataController } from "https://cdn.skypack.dev/lotivis-data@1";

const data = [/* */]
const dc = new DataController(data);

</script>
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

### Repository management

```bash
# make sure working dir is clean

# patch version of project
npm version patch

# puch version update
git push --follow-tags

```

## Dependency

- [D3.js](https://github.com/mbostock/d3) `^5.0.0`

## License

MIT
