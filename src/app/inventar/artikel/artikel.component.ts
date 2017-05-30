import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { InventarService } from '../services/inventar.service';
import { Artikel } from '../models/artikel';
import { DatabaseService } from '../services/database.service';

import { MaterialModule } from '@angular/material';
import { FormsModule } from '@angular/forms';

@Component({
  templateUrl: './artikel.component.html',
  styleUrls: ['./artikel.component.css']
})

export class ArtikelComponent implements OnInit {
  artikel: Artikel = {} as Artikel;
  kategorien: string[];
  private artikelChanged = false;

  onSubmit() {
    if (this.artikel._id) {
      this.dbService.update(this.artikel);
    } else {
      this.dbService.insert(this.artikel);
    }
    this.artikelChanged = true;
  }

  constructor(
    private route: ActivatedRoute,
    private dbService: DatabaseService,
    private inventarService: InventarService,
    private location: Location) {
    const id: string = this.route.snapshot.params['id'];
    if (id !== undefined) {
      this.dbService.getArtikel(id).then(artikel => this.artikel = artikel);
    }
  }

  ngOnInit() {
    this.kategorien = this.inventarService.kategorien;
  }

  next() {
    this.artikel = this.dbService.nextInKategorieFor(this.artikel);
    return this.artikel;
  }

  previous() {
    this.artikel = this.dbService.previousInKategorieFor(this.artikel);
    return this.artikel;
  }

  back() {
    this.location.back();
  }

  delete() {
    this.dbService.delete(this.artikel._id);
    this.next();
  }

  addPhoto() {
    this.artikel.imagePath = this.inventarService.addPhoto();
  }

  artikelChangedQueryParam(): any {
    return { reload: this.artikelChanged };
  }
}

