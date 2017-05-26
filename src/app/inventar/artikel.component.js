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
var common_1 = require("@angular/common");
var router_1 = require("@angular/router");
var inventar_service_1 = require("./inventar.service");
var database_service_1 = require("./database.service");
var ArtikelComponent = (function () {
    function ArtikelComponent(route, dbService, inventarService, location) {
        var _this = this;
        this.route = route;
        this.dbService = dbService;
        this.inventarService = inventarService;
        this.location = location;
        this.artikel = {};
        this.artikelChanged = false;
        var id = this.route.snapshot.params['id'];
        if (id !== undefined) {
            this.dbService.getArtikel(id).then(function (artikel) { return _this.artikel = artikel; });
        }
    }
    ArtikelComponent.prototype.onSubmit = function () {
        if (this.artikel._id) {
            this.dbService.update(this.artikel);
        }
        else {
            this.dbService.insert(this.artikel);
        }
        this.artikelChanged = true;
    };
    Object.defineProperty(ArtikelComponent.prototype, "diagnostic", {
        // TODO: Remove this when we're done
        get: function () { return JSON.stringify(this.artikel); },
        enumerable: true,
        configurable: true
    });
    ArtikelComponent.prototype.ngOnInit = function () {
        this.kategorien = this.inventarService.kategorien;
    };
    ArtikelComponent.prototype.next = function () {
        this.artikel = this.dbService.nextFor(this.artikel);
        return this.artikel;
    };
    ArtikelComponent.prototype.previous = function () {
        this.artikel = this.dbService.previousFor(this.artikel);
        return this.artikel;
    };
    ArtikelComponent.prototype.back = function () {
        this.location.back();
    };
    ArtikelComponent.prototype.delete = function () {
        this.dbService.delete(this.artikel._id);
        this.next();
    };
    ArtikelComponent.prototype.artikelChangedQueryParam = function () {
        return { reload: this.artikelChanged };
    };
    return ArtikelComponent;
}());
ArtikelComponent = __decorate([
    core_1.Component({
        templateUrl: './app/inventar/artikel.component.html',
        styleUrls: ['./app/inventar/artikel.component.css']
    }),
    __metadata("design:paramtypes", [router_1.ActivatedRoute, typeof (_a = typeof database_service_1.DatabaseService !== "undefined" && database_service_1.DatabaseService) === "function" && _a || Object, typeof (_b = typeof inventar_service_1.InventarService !== "undefined" && inventar_service_1.InventarService) === "function" && _b || Object, common_1.Location])
], ArtikelComponent);
exports.ArtikelComponent = ArtikelComponent;
var _a, _b;
//# sourceMappingURL=artikel.component.js.map