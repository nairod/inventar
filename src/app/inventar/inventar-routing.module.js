"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var inventar_component_1 = require("./inventar.component");
var inventarliste_component_1 = require("./inventarliste/inventarliste.component");
var inventardruck_component_1 = require("./inventardruck/inventardruck.component");
var artikel_component_1 = require("./artikel/artikel.component");
var routes = [
    {
        path: '',
        component: inventar_component_1.InventarComponent,
        children: [
            { path: 'new', component: artikel_component_1.ArtikelComponent },
            { path: 'print', component: inventarliste_component_1.InventarlisteComponent },
            { path: ':id', component: artikel_component_1.ArtikelComponent },
            { path: '', component: inventardruck_component_1.InventardruckComponent }
        ]
    }
];
var InventarRoutingModule = (function () {
    function InventarRoutingModule() {
    }
    return InventarRoutingModule;
}());
InventarRoutingModule = __decorate([
    core_1.NgModule({
        imports: [router_1.RouterModule.forChild(routes)],
        exports: [router_1.RouterModule]
    })
], InventarRoutingModule);
exports.InventarRoutingModule = InventarRoutingModule;
//# sourceMappingURL=inventar-routing.module.js.map