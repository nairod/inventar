import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { InventarService } from '../services/inventar.service';
import { Artikel } from '../models/artikel';
import { DatabaseService } from '../services/database.service';

@Component({
  templateUrl: './app/inventar/artikel/artikel.component.html',
  styleUrls: ['./app/inventar/artikel/artikel.component.css']
})

export class ArtikelComponent implements OnInit {
  artikel: Artikel = {} as Artikel;
  kategorien: string[];
  private artikelChanged: boolean = false;

  onSubmit() {
    if (this.artikel._id) {
      this.dbService.update(this.artikel);
    } else {
      this.dbService.insert(this.artikel);
    }
    this.artikelChanged = true;
  }

  // TODO: Remove this when we're done
  get diagnostic() { return JSON.stringify(this.artikel); }

  constructor(
    private route: ActivatedRoute,
    private dbService: DatabaseService,
    private inventarService: InventarService,
    private location: Location) {
    let id: string = this.route.snapshot.params['id'];
    if (id !== undefined) {
      this.dbService.getArtikel(id).then(artikel => this.artikel = artikel);
    }
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

  delete() {
    this.dbService.delete(this.artikel._id);
    this.next();
  }

  artikelChangedQueryParam(): any {
    return { reload: this.artikelChanged };
  }
}

