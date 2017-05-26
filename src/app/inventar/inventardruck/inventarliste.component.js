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
var database_service_1 = require("../services/database.service");
var inventar_service_1 = require("../services/inventar.service");
var InventarlisteComponent = (function () {
    function InventarlisteComponent(_dbService, _inventarService) {
        this._dbService = _dbService;
        this._inventarService = _inventarService;
        this.columns = [
            { name: 'imagePath' },
            { prop: 'name' },
            { name: 'einstandspreis' },
            { name: 'kategorie' },
            { name: 'verkaufspreis' }
        ];
        this.rows = [];
        this.temp = [];
        this.loaded = false;
    }
    InventarlisteComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.kategorien = this._inventarService.kategorien;
        this.inventarliste = this._dbService.artikelObservable;
        this._dbService.artikelObservable.subscribe(function (liste) {
            _this.temp = liste.slice();
            _this.rows = liste;
            _this.loaded = liste.length > 0;
        });
        this._dbService.openDatabase('mainDB').loadAll();
    };
    InventarlisteComponent.prototype.updateFilter = function (event) {
        var val = event.target.value;
        // filter our data
        var temp = this.temp.filter(function (f) {
            return !val || f.kategorie.indexOf(val) !== -1 || f.name.indexOf(val) !== -1;
        });
        // update the rows
        this.rows = temp;
    };
    InventarlisteComponent.prototype.reload = function () {
        this._dbService.loadAll();
    };
    return InventarlisteComponent;
}());
InventarlisteComponent = __decorate([
    core_1.Component({
        templateUrl: './app/inventar/inventarliste/inventarliste.component.html',
    }),
    __metadata("design:paramtypes", [database_service_1.DatabaseService, inventar_service_1.InventarService])
], InventarlisteComponent);
exports.InventarlisteComponent = InventarlisteComponent;
//# sourceMappingURL=inventarliste.component.js.map