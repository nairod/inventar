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
  kategorieComboListe: Kategorie[] = [];
  tempKategorien: Kategorie[] = [];
  inventarliste: Observable<Artikel[]>;
  loaded = false;
  selectedValue: string[] = [];

  constructor(private _dbService: DatabaseService, private _inventarService: InventarService) {

    this.inventarliste = this._dbService.artikelObservable;
    this._dbService.artikelObservable.subscribe(liste => {
      this.kategorien = [];
      this.kategorieComboListe = [];
      _(liste).chain()
        .groupBy(art => art.kategorie)
        .forEach((group: Artikel[]) => {
          const kat = new Kategorie(group[0].kategorie, group);
          this.kategorien.push(kat);
          this.kategorieComboListe.push(kat);
          this.selectedValue.push(kat.name);
          console.log(group[0].kategorie);
        })
        .value();
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
    this.kategorien = temp;
  }
  reload() {
    this.loaded = false;
    this._dbService.loadAll().then(() => {
      this.loaded = true;
    });
  }
}
