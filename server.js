/**
 * FRC-Visualization
 *
 * Author:
 *  - Lukas Danckwerth
 */
const express = require("express");
const app = express();
const application_version = require('./package.json').version;
const port = process.env.PORT || 80;

app.use('/', express.static(__dirname + '/example'));
app.use('/dist', express.static(__dirname + '/dist'));

app.listen(port, function() {
    console.log("start lotivis example " + application_version);
    console.log("listening on port: " + port);
});
