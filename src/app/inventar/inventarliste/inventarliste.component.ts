import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs/Rx';
import { MaterialModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import * as _ from 'lodash';

import { Artikel } from '../models/artikel';
import { Kategorie } from '../models/kategorie';
import { DatabaseService } from '../services/database.service';
import { InventarService } from '../services/inventar.service';

@Component({
  templateUrl: './inventarliste.component.html',
})


export class InventarlisteComponent implements OnInit {
  columns: any = [
    { name: 'imagePath' },
    { prop: 'name' },
    { name: 'einstandspreis' },
    { name: 'kategorie' },
    { name: 'verkaufspreis' }
  ];

  kategorien: Kategorie[] = [];
  kategorieComboListe: string[] = [];
  tempKategorien: Kategorie[] = [];
  inventarliste: Observable<Artikel[]>;
  loaded = false;
  selectedValue: string[] = [];
  totalEp: number;
  totalVp: number;
  totalCount: number;

  constructor(private _dbService: DatabaseService, private _inventarService: InventarService) {

    this.inventarliste = this._dbService.artikelObservable;
    this._dbService.kategorieObservable.subscribe(liste => {
      this.kategorien = liste;
      this.kategorieComboListe = [];
      _(liste).chain()
        .forEach((kat: Kategorie) => {
          this.kategorieComboListe.push(kat.name);
          this.selectedValue.push(kat.name);
        })
        .value();
      this.calculateGrandTotals(this.kategorien);
      this.tempKategorien = [...this.kategorien];
    });
  }

  ngOnInit() {
    this._dbService.openDatabase().loadAll().then(() => this.loaded = true);
  }

  kategorieChange() {
    console.log(this.selectedValue);
    const temp = _.filter(
      this.tempKategorien, k => {
        return this.selectedValue.indexOf(k.name) > -1;
      }
    );

    this.calculateGrandTotals(temp);
    this.kategorien = temp;
  }

  calculateGrandTotals(kategorien: Kategorie[]) {
    let totalCount = 0, totalEp = 0, totalVp = 0;
    kategorien.forEach(t => {
      totalCount += t.totalCount;
      totalEp += t.totalEP;
      totalVp += t.totalVP;
    });

    this.totalCount = totalCount;
    this.totalEp = totalEp;
    this.totalVp = totalVp;

  }


  reload() {
    this.loaded = false;
    this._dbService.loadAll().then(() => {
      this.loaded = true;
    });
  }
}
