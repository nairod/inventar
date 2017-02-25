"use strict";
var fs = require('fs');

var Datastore = require('nedb'),
  db = new Datastore({
    filename: __dirname + '/datastore/inventar.nedb',
    autoload: true
  });

db.ensureIndex({
  fieldName: 'imagePath',
  unique: true
});

global.datastore = db;

const photoFolder = __dirname + '/datastore/photos/';
const photos_on_disk = fs.readdirSync(photoFolder);

photos_on_disk.forEach(photo => {

  db.insert({
    name: '',
    kategorie: '',
    einstandspreis: 0,
    verkaufspreis: 0,
    imagePath: '../electron/datastore/photos/' + photo
  });
  console.log('load: ' + photo)
});
