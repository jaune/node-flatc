#!/usr/bin/env node

var os = require('os'),
  path = require('path'),
  nugget = require('nugget'),
  extract = require('extract-zip'),
  fs = require('fs');

var platform = os.platform();
var arch = os.arch();
var version = '1.0.3';
var filename = 'flatc-v' + version + '-' + platform + '-' + arch + '.zip';
var url = 'https://github.com/jaune/flatbuffers/releases/download/v' + version + '/flatc-v' + version + '-' + platform + '-' + arch + '.zip';

function onerror (err) {
  throw err;
}

var paths = {
  //darwin: path.join(__dirname, './dist/Flatc.app/Contents/MacOS/Flatc'),
  //linux: path.join(__dirname, './dist/flatc'),
  win32: path.join(__dirname, './dist/flatc.exe')
};

var shebang = {
  darwin: '#!/bin/bash\n',
  linux: '#!/bin/bash\n',
  win32: ''
};

var argv = {
  darwin: '"$@"',
  linux: '"$@"',
  win32: '%*' // does this work with " " in the args?
};

if (!paths[platform]) throw new Error('Unknown platform: ' + platform);

nugget(url, {target: filename, dir: __dirname, resume: true, verbose: true}, function (err) {
  if (err) return onerror(err);
  fs.writeFileSync(path.join(__dirname, 'path.txt'), paths[platform]);
  fs.writeFileSync(path.join(__dirname, 'run.bat'), shebang[platform] + '"' + paths[platform] + '" ' + argv[platform]);
  extract(path.join(__dirname, filename), {dir: path.join(__dirname, 'dist')}, function (err) {
    if (err) return onerror(err);
  });
});
