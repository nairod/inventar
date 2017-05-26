"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var Kategorie = (function () {
    function Kategorie(name, artikelliste) {
        this.name = name;
        this.artikelliste = artikelliste;
        this.totalEP = _.sumBy(artikelliste, function (a) { return a.einstandspreis; });
        this.totalVP = _.sumBy(artikelliste, function (a) { return a.verkaufspreis; });
        this.chunks = _.chunk(artikelliste, 4);
    }
    return Kategorie;
}());
exports.Kategorie = Kategorie;
//# sourceMappingURL=kategorie.js.map