/**
 * server.js lotivis
 *
 * Discussion:
 * Serves the docs of lotivis.  Using an Node.js express app as server.
 *
 * Author:
 *  - Lukas Danckwerth
 */
const express = require("express");
const app = express();
const version = require('./package.json').version;
const port = process.env.PORT || 80;

app.use('/', express.static(__dirname + '/docs'));
app.use('/dist', express.static(__dirname + '/dist'));
app.listen(port, function () {
  console.log("start lotivis docs " + version);
  console.log("listening on port: " + port);
});
