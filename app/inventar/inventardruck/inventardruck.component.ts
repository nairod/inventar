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
  inventarliste: Observable<Artikel[]>;
  loaded: boolean = false;
  constructor(private _dbService: DatabaseService, private _inventarService: InventarService) {
  }

  ngOnInit() {
    this.inventarliste = this._dbService.artikelObservable;


    this._dbService.artikelObservable.subscribe(liste => {
      _(liste).chain()
        .groupBy(art => art.kategorie)
        .forEach((group: Artikel[]) => {
          this.kategorien.push(new Kategorie(group[0].kategorie, group));
          console.log(group[0].kategorie);
        })
        .value();
      this.loaded = liste.length > 0;
    });
    this._dbService.openDatabase('mainDB').loadAll();
  }


  reload() {
    this._dbService.loadAll();
  }
}
