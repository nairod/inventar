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
    { prop: 'Name' },
    { name: 'Einstandspreis' },
    { name: 'Kategorie' },
    { name: 'Verkaufspreis' }
  ];

  rows: any[] = [];

  inventarliste: Promise<Artikel[]>;
  constructor(private inventarService: InventarService) {
    this.inventarService.getInventarliste().then(liste => this.rows = liste);
  }


  ngOnInit() {
    this.inventarliste = this.inventarService.getInventarliste();
  }
}
