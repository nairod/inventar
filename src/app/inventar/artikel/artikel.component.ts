import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { InventarService } from '../services/inventar.service';
import { Artikel } from '../models/artikel';
import { Kategorie } from '../models/kategorie';
import { DatabaseService } from '../services/database.service';
import { ArtikelDeleteDialog } from './artikel-delete.component';
import { MaterialModule } from '@angular/material';
import { MdSnackBar } from '@angular/material';
import { MdDialog, MdDialogRef, MdDialogConfig } from '@angular/material';
import { FormsModule } from '@angular/forms';
import * as _ from 'lodash';

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
    this.showNotification('Artikel gespeichert');
    this.artikelChanged = true;
  }

  constructor(
    private route: ActivatedRoute,
    private dbService: DatabaseService,
    private inventarService: InventarService,
    private location: Location,
    private snackBar: MdSnackBar,
    private dialog: MdDialog
  ) {
    const id: string = this.route.snapshot.params['id'];
    if (id !== undefined) {
      this.dbService.getArtikel(id).then(artikel => this.artikel = artikel);
    }
  }

  ngOnInit() {
    this.dbService.kategorieObservable.subscribe(liste => {
      this.kategorien = [];
      _(liste).chain()
        .forEach((kat: Kategorie) => {
          this.kategorien.push(kat.name);
        })
        .value();
    });
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
    let dialogRef = this.dialog.open(ArtikelDeleteDialog);
    dialogRef.afterClosed().subscribe(result => {
      if ('delete' === result) {
        this.dbService.delete(this.artikel._id);
        this.showNotification('Artikel gelöscht');
        this.next();
      }
    });
  }

  addPhoto() {
    this.artikel.imagePath = this.inventarService.addPhoto();
  }

  artikelChangedQueryParam(): any {
    return { reload: this.artikelChanged };
  }

  private showNotification(message: string) {
    this.snackBar.open(message, null, { duration: 2000 });
  }
}

