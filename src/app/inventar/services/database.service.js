"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var Rx_1 = require("rxjs/Rx");
var core_1 = require("@angular/core");
var Datastore = require("nedb");
var ngx_electron_1 = require("ngx-electron");
var DatabaseService = (function () {
    function DatabaseService(_electronService, _ngZone) {
        this._electronService = _electronService;
        this._ngZone = _ngZone;
        this.artikelStore = { liste: [] };
        this._artikelSubject = new Rx_1.BehaviorSubject([]);
        this.artikelObservable = this._artikelSubject.asObservable();
        console.log('BehaviorSubject', this._artikelSubject);
        console.log('Observable', this.artikelObservable);
    }
    DatabaseService.prototype.openDatabase = function (folderName) {
        this.dbPath = folderName;
        var db = new Datastore({
            filename: folderName + '/inventarBig.nedb',
            autoload: true
        });
        /*
        db.ensureIndex({
          fieldName: 'imagePath',
          unique: true
        });
        */
        this.inventarDB = db;
        return this;
    };
    DatabaseService.prototype.importDatabaseFile = function (dbFileName, legacy) {
        var _this = this;
        var nativeImage = this._electronService.remote.require('electron').nativeImage;
        var Datastore = this._electronService.remote.require('nedb'), db = new Datastore({
            filename: dbFileName,
            autoload: true
        });
        db.find({}, function (e, docs) {
            if (!e) {
                for (var _i = 0, docs_1 = docs; _i < docs_1.length; _i++) {
                    var importedArtikel = docs_1[_i];
                    // TODO: auslagern da Duplikat in inventarservice, imagepath in imagedataurl umbenennen
                    if (legacy) {
                        var image = nativeImage.createFromPath(importedArtikel.imagePath);
                        if (!image.isEmpty()) {
                            var resizedImage = image.resize({ width: 400 });
                            importedArtikel.imagePath = resizedImage.toDataURL();
                        }
                        else {
                            console.log('bild konnte nicht geladen werden: ' + importedArtikel.imagePath);
                        }
                    }
                    _this.inventarDB.insert(importedArtikel);
                    console.log('inserted artikel: ' + importedArtikel);
                }
            }
        });
    };
    DatabaseService.prototype.exportDatabaseFile = function (toFileName) {
        var Datastore = this._electronService.remote.require('nedb'), exportDB = new Datastore({
            filename: toFileName,
            autoload: true
        });
        this.inventarDB.find({}, function (e, docs) {
            if (!e) {
                for (var _i = 0, docs_2 = docs; _i < docs_2.length; _i++) {
                    var artikel = docs_2[_i];
                    exportDB.insert(artikel);
                    console.log('exported artikel: ' + artikel);
                }
            }
        });
    };
    DatabaseService.prototype.loadAll = function () {
        var _this = this;
        this._ngZone.run(function () {
            _this.inventarDB.find({}, function (e, docs) {
                if (!e) {
                    _this.artikelStore.liste = docs;
                    _this._artikelSubject.next(_this.artikelStore.liste);
                    console.log('dbservice subject', _this._artikelSubject);
                    console.log('dbservice items', _this.artikelObservable);
                }
            });
        });
    };
    DatabaseService.prototype.loadByKategorie = function (kategorien) {
        var _this = this;
        this._ngZone.run(function () {
            _this.inventarDB.find({ kategorie: kategorien }, function (e, docs) {
                if (!e) {
                    _this.artikelStore.liste = docs;
                    _this._artikelSubject.next(_this.artikelStore.liste);
                    console.log('dbservice subject', _this._artikelSubject);
                    console.log('dbservice items', _this.artikelObservable);
                }
            });
        });
    };
    DatabaseService.prototype.getArtikel = function (id) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            return _this.inventarDB.findOne({ _id: id }, (function (err, artikel) {
                if (err) {
                    reject(err);
                    console.log('Failed to load', artikel.name);
                }
                else {
                    console.log('Got', artikel.name);
                    resolve(artikel);
                }
            }));
        });
    };
    DatabaseService.prototype.update = function (artikel) {
        this.inventarDB.update({ _id: artikel._id }, {
            $set: {
                name: artikel.name,
                kategorie: artikel.kategorie,
                einstandspreis: artikel.einstandspreis,
                verkaufspreis: artikel.verkaufspreis,
                imagePath: artikel.imagePath
            }
        }, {
            multi: false
        }, function (err, numReplaced) {
            if (err) {
                console.log('error storing ', artikel.name);
            }
            else {
                console.log('updated ', artikel.name);
            }
        });
    };
    DatabaseService.prototype.delete = function (id) {
        var index = this.artikelStore.liste.findIndex(function (arti) { return arti._id === id; });
        if (index > -1) {
            this.artikelStore.liste.splice(index, 1);
        }
        this._artikelSubject.next(this.artikelStore.liste);
        this.inventarDB.remove({ _id: id }, {}, function (err, numRemoved) {
        });
    };
    DatabaseService.prototype.insert = function (artikel) {
        this.inventarDB.insert(artikel, function (err, doc) {
            if (!err) {
                console.log('inserted artikel with id ' + doc._id);
            }
            else {
                console.log('failed to insert artikel');
            }
        });
    };
    DatabaseService.prototype.deleteAll = function () {
        this.inventarDB.remove({}, { multi: true }, function (err, numRemoved) {
            /*this.inventarDB.loadDatabase(function (err1) {
              // done
            });*/
        });
        this.loadAll();
    };
    DatabaseService.prototype.nextFor = function (artikel) {
        var ix = this.artikelStore.liste.findIndex(function (arti) { return arti._id === artikel._id; });
        if (ix === (this.artikelStore.liste.length - 1)) {
            ix = 0;
        }
        else {
            ix++;
        }
        return this.artikelStore.liste[ix];
    };
    DatabaseService.prototype.previousFor = function (artikel) {
        var ix = this.artikelStore.liste.findIndex(function (arti) { return arti._id === artikel._id; });
        if (ix === 0) {
            ix = (this.artikelStore.liste.length - 1);
        }
        else {
            ix--;
        }
        return this.artikelStore.liste[ix];
    };
    return DatabaseService;
}());
DatabaseService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [ngx_electron_1.ElectronService, core_1.NgZone])
], DatabaseService);
exports.DatabaseService = DatabaseService;
//# sourceMappingURL=database.service.js.map