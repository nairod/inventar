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
var core_1 = require("@angular/core");
var ngx_electron_1 = require("ngx-electron");
var database_service_1 = require("./database.service");
var artikel_1 = require("../models/artikel");
var InventarService = (function () {
    function InventarService(_databaseService, _electronService) {
        this._databaseService = _databaseService;
        this._electronService = _electronService;
        this._kategorien = ['Anhänger', 'Perlenkette', 'Edelsteine ', 'Eheringe', 'Kinderketteli',
            'Ring', 'Ohrschmuck', 'Collier', 'Armkette'];
        this.printSettings = {
            landscape: false,
            marginsType: 1,
            printBackground: false,
            printSelectionOnly: false,
            pageSize: 'A4',
        };
    }
    Object.defineProperty(InventarService.prototype, "kategorien", {
        get: function () {
            return this._kategorien;
        },
        enumerable: true,
        configurable: true
    });
    InventarService.prototype.openInventar = function () {
        var folder = this.getFolder();
        console.log(folder);
        this._databaseService.openDatabase(folder);
        this._databaseService.loadAll();
    };
    InventarService.prototype.getFolder = function () {
        return this._electronService.remote.dialog.showOpenDialog({
            title: 'Ordner auswählen',
            properties: ['openDirectory']
        })[0];
    };
    ;
    InventarService.prototype.getFile = function () {
        return this._electronService.remote.dialog.showOpenDialog({
            title: 'Datei auswählen',
            properties: ['openFile']
        })[0];
    };
    ;
    InventarService.prototype.createImage = function (photo) {
        var nativeImage = this._electronService.remote.require('electron').nativeImage;
        var image = nativeImage.createFromPath(photo);
        return image.resize({ width: 600 });
    };
    InventarService.prototype.addPhoto = function () {
        var photoPath = this._electronService.remote.dialog.showOpenDialog({
            title: 'Foto auswählen',
            properties: ['openFile'],
            filters: [{ name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif'] }]
        })[0];
        return this.createImage(photoPath).toDataURL();
    };
    InventarService.prototype.loadPhotos = function () {
        var recursiveReadSync = this._electronService.remote.require('recursive-readdir-sync');
        var sourcePath = this.getFolder();
        var photos_on_disk = recursiveReadSync(sourcePath);
        for (var _i = 0, photos_on_disk_1 = photos_on_disk; _i < photos_on_disk_1.length; _i++) {
            var photo = photos_on_disk_1[_i];
            var resizedImage = this.createImage(photo);
            var artikel = new artikel_1.Artikel(undefined, undefined, undefined, 0, 0, resizedImage.toDataURL());
            this._databaseService.insert(artikel);
            console.log(photo + ' inserted');
        }
        this._databaseService.loadAll();
    };
    InventarService.prototype.importDatabase = function () {
        var file = this.getFile();
        console.log('import: ' + file);
        this._databaseService.importDatabaseFile(file, false);
    };
    InventarService.prototype.exportDatabase = function () {
        var file = this.getFile();
        console.log('export: ' + file);
        this._databaseService.exportDatabaseFile(file);
    };
    InventarService.prototype.print = function () {
        var file = this.getFile();
        var fs = this._electronService.remote.require('fs');
        this._electronService.remote.webContents.getFocusedWebContents().printToPDF(this.printSettings, function (err, data) {
            if (err) {
                // dialog.showErrorBox('Error', err);
                return;
            }
            fs.writeFile(file, data, function (err1) {
                if (err1) {
                    // dialog.showErrorBox('Error', err);
                    return;
                }
            });
        });
    };
    return InventarService;
}());
InventarService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService, ngx_electron_1.ElectronService])
], InventarService);
exports.InventarService = InventarService;
//# sourceMappingURL=inventar.service.js.map