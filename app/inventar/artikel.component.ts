import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {
  Artikel,
  InventarService
} from './inventar.service';

@Component({
  template: `
    <h3 highlight>Artikel</h3>
    <div *ngIf="artikel">
      <div>Id: {{artikel.id}}</div><br>
      <label>Name:
        <input [(ngModel)]="artikel.name">
      </label>
    </div>
    <br>
    <a routerLink="../">Inventarliste</a>
  `
})

export class ArtikelComponent implements OnInit {
  artikel: Artikel;

  constructor(
    private route: ActivatedRoute,
    private inventarService: InventarService) { }

  ngOnInit() {
    let id = parseInt(this.route.snapshot.params['id'], 10);
    this.inventarService.getArtikel(id).then(artikel => this.artikel = artikel);
  }
}

