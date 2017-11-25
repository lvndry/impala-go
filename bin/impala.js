var path = require('path')
var shell = require('shelljs')

var main = path.join(__dirname, '../main.js');

shell.exec('electron ' + main);
