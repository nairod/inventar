import { runInThisContext } from 'vm';
import { Component, OnInit } from '@angular/core';


import {
  Artikel,
  InventarService
} from './inventar.service';


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
  inventarliste: Promise<Artikel[]>;
  constructor(private inventarService: InventarService) {
    this.inventarService.getInventarliste().then(liste => {
      this.temp = [...liste];
      this.rows = liste;
    });
  }


  ngOnInit() {
    this.inventarliste = this.inventarService.getInventarliste();
    this.kategorien = this.inventarService.kategorien;
  }

  updateFilter(event: any) {
    let val = event.target.value;

    // filter our data
    const temp = this.temp.filter(f => {
      return !val || f.kategorie.toLowerCase().indexOf(val) !== -1 || f.name.toLowerCase().indexOf(val) !== -1;
    });

    // update the rows
    this.rows = temp;
  }
}
