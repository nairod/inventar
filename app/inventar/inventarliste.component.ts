import { Component, OnInit } from '@angular/core';

import {
  Artikel,
  InventarService
} from './inventar.service';

@Component({
  template: `
    <h3 highlight>Inventarliste</h3>
    <div *ngFor='let artikel of inventarliste | async'>
      <a routerLink="{{artikel.id}}">{{artikel.id}} - {{artikel.name}}</a>
    </div>
  `
})
export class InventarlisteComponent implements OnInit {
  inventarliste: Promise<Artikel[]>;
  constructor(private inventarService: InventarService) { }

  ngOnInit() {
    this.inventarliste = this.inventarService.getInventarliste();
  }
}
