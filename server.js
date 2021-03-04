/**
 * FRC-Visualization
 *
 * Author:
 *  - Lukas Danckwerth
 */
const express = require("express");
const app = express();
const version = require('./package.json').version;
const port = process.env.PORT || 80;

app.use('/', express.static(__dirname + '/public'));
app.use('/dist', express.static(__dirname + '/dist'));

app.use('./info', function (req,res) {
  res.json({version});
  res.end();
});

app.listen(port, function() {
    console.log("start lotivis public " + version);
    console.log("listening on port: " + port);
});
