import * as _ from 'lodash';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { Artikel } from './inventar.service';
import { DatabaseService } from './database.service';
import { InventarService } from './inventar.service';

@Component({
  templateUrl: './app/inventar/inventarliste.component.html',
})


export class InventarlisteComponent implements OnInit {
  columns: any = [
    { name: 'imagePath' },
    { prop: 'name' },
    { name: 'einstandspreis' },
    { name: 'kategorie' },
    { name: 'verkaufspreis' }
  ];

  rows: any[] = [];
  temp: any[] = [];
  kategorien: string[];
  inventarliste: Observable<Artikel[]>;

  constructor(private _dbService: DatabaseService, private _inventarService: InventarService) {

  }

  ngOnInit() {
    this.kategorien = this._inventarService.kategorien;
    this.inventarliste = this._dbService.artikelObservable;
    this._dbService.artikelObservable.subscribe(liste => {
      this.temp = [...liste];
      this.rows = liste;
    });
    this._dbService.openDatabase('mainDB').loadAll();
  }


  updateFilter(event: any) {
    let val: string = event.target.value;
    // filter our data
    const temp = this.temp.filter(f => {
      return !val || f.kategorie.toLowerCase().indexOf(val.toLowerCase()) !== -1 || f.name.toLowerCase().indexOf(val.toLowerCase()) !== -1;
    });

    // update the rows
    this.rows = temp;
  }

  reload() {
    this._dbService.loadAll();
  }
}
