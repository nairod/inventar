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
var _ = require("lodash");
var core_1 = require("@angular/core");
var kategorie_1 = require("../models/kategorie");
var database_service_1 = require("../services/database.service");
var inventar_service_1 = require("../services/inventar.service");
var InventardruckComponent = (function () {
    function InventardruckComponent(_dbService, _inventarService) {
        this._dbService = _dbService;
        this._inventarService = _inventarService;
        this.columns = [
            { name: 'imagePath' },
            { prop: 'name' },
            { name: 'einstandspreis' },
            { name: 'kategorie' },
            { name: 'verkaufspreis' }
        ];
        this.kategorien = [];
        this.kategorieComboListe = [];
        this.tempKategorien = [];
        this.loaded = false;
        this.selectedValue = [];
    }
    InventardruckComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.inventarliste = this._dbService.artikelObservable;
        this._dbService.artikelObservable.subscribe(function (liste) {
            _(liste).chain()
                .groupBy(function (art) { return art.kategorie; })
                .forEach(function (group) {
                var kat = new kategorie_1.Kategorie(group[0].kategorie, group);
                _this.kategorien.push(kat);
                _this.kategorieComboListe.push(kat);
                _this.selectedValue.push(kat.name);
                console.log(group[0].kategorie);
            })
                .value();
            _this.loaded = liste.length > 0;
            _this.tempKategorien = _this.kategorien.slice();
        });
        this._dbService.openDatabase('mainDB').loadAll();
    };
    InventardruckComponent.prototype.kategorieChange = function () {
        var _this = this;
        console.log(this.selectedValue);
        var temp = _.filter(this.tempKategorien, function (k) {
            return _this.selectedValue.indexOf(k.name) > -1;
        });
        this.kategorien = temp;
    };
    InventardruckComponent.prototype.reload = function () {
        this._dbService.loadAll();
    };
    return InventardruckComponent;
}());
InventardruckComponent = __decorate([
    core_1.Component({
        templateUrl: './app/inventar/inventardruck/inventardruck.component.html',
    }),
    __metadata("design:paramtypes", [database_service_1.DatabaseService, inventar_service_1.InventarService])
], InventardruckComponent);
exports.InventardruckComponent = InventardruckComponent;
//# sourceMappingURL=inventardruck.component.js.map