# lotivis package development

## Create package directory

```bash
mkdir lotivis-$PACKAGE_NAME
```

## Add rollup dependencies

```bash
yarn add --dev rollup @rollup/plugin-node-resolve rollup-plugin-terser

# for tests add mocha
yarn add --dev mocha

# if you develop a chart with scss / css
yarn add --dev node-sass postcss rollup-plugin-postcss
```