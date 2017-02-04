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

const photos_on_disk = fs.readdirSync(__dirname + '/datastore/photos');

photos_on_disk.forEach(photo => {

  db.insert({
    name: '',
    kategorie: '',
    ep: 0,
    vp: 0,
    imagePath: photo
  });
  console.log('load: ' + photo)
});
