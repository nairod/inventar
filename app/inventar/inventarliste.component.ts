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

  inventarliste: Promise<Artikel[]>;
  constructor(private inventarService: InventarService) {
    this.inventarService.getInventarliste().then(liste => {
      this.temp = [...liste];
      this.rows = liste;
    });
  }


  ngOnInit() {
    this.inventarliste = this.inventarService.getInventarliste();
  }

  updateFilter(event: any) {
    let val = event.target.value;

    // filter our data
    const temp = this.temp.filter(function (d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.rows = temp;
  }
}
