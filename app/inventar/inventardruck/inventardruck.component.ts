import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash';
import { Component, OnInit } from '@angular/core';

import { Artikel } from '../models/artikel';
import { Kategorie } from '../models/kategorie';
import { DatabaseService } from '../services/database.service';
import { InventarService } from '../services/inventar.service';

@Component({
  templateUrl: './app/inventar/inventardruck/inventardruck.component.html',
})


export class InventardruckComponent implements OnInit {
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
  loaded: boolean = false;
  selectedValue: string[] = [];
  constructor(private _dbService: DatabaseService, private _inventarService: InventarService) {
  }

  ngOnInit() {
    this.inventarliste = this._dbService.artikelObservable;
    this._dbService.artikelObservable.subscribe(liste => {
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
      this.loaded = liste.length > 0;
      this.tempKategorien = [...this.kategorien];
    });
    this._dbService.openDatabase('mainDB').loadAll();
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
    this._dbService.loadAll();
  }
}
