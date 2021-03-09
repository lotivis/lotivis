/**
 * server.js lotivis
 *
 * Discussion:
 * Serves the examples of lotivis.  Using an Node.js express app for as server.
 *
 * Author:
 *  - Lukas Danckwerth
 */
const express = require("express");
const app = express();
const version = require('./package.json').version;
const port = process.env.PORT || 80;

app.use('/', express.static(__dirname + '/examples'));
app.use('/dist', express.static(__dirname + '/dist'));
app.use('/version', function (req, res) {
  res.json({version});
  res.end();
});

app.listen(port, function () {
  console.log("start lotivis examples " + version);
  console.log("listening on port: " + port);
});
