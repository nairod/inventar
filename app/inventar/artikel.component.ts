import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { Artikel, InventarService } from './inventar.service';
import { DatabaseService } from './database.service';

@Component({
  templateUrl: './app/inventar/artikel.component.html',
  styleUrls: ['./app/inventar/artikel.component.css']
})

export class ArtikelComponent implements OnInit {
  artikel: Artikel = {} as Artikel;
  kategorien: string[];

  onSubmit() {
    this.dbService.update(this.artikel);
  }

  // TODO: Remove this when we're done
  get diagnostic() { return JSON.stringify(this.artikel); }

  constructor(
    private route: ActivatedRoute,
    private dbService: DatabaseService,
    private inventarService: InventarService,
    private location: Location) {
    let id: string = this.route.snapshot.params['id'];
    this.dbService.getArtikel(id).then(artikel => this.artikel = artikel);
  }

  ngOnInit() {
    this.kategorien = this.inventarService.kategorien;
  }

  next() {
    this.artikel = this.dbService.nextFor(this.artikel);
    return this.artikel;
  }

  previous() {
    this.artikel = this.dbService.previousFor(this.artikel);
    return this.artikel;
  }
  back() {
    this.location.back();
  }
}

