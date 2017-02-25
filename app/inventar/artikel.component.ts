import { FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import {
  Artikel,
  InventarService
} from './inventar.service';

@Component({
  templateUrl: './app/inventar/artikel.component.html',
  styleUrls: ['./app/inventar/artikel.component.css']
})

export class ArtikelComponent implements OnInit {
  artikel: Artikel = {} as Artikel;
  Kategorien: string[];

  onSubmit() {
    this.inventarService.update(this.artikel);
  }

  // TODO: Remove this when we're done
  get diagnostic() { return JSON.stringify(this.artikel); }

  constructor(
    private route: ActivatedRoute,
    private inventarService: InventarService) {
    let id: string = this.route.snapshot.params['id'];
    this.inventarService.getArtikel(id).then(artikel => this.artikel = artikel);
  }

  ngOnInit() {
    this.Kategorien = this.inventarService.Kategorien;
  }

  next() {
    this.artikel = this.inventarService.nextFor(this.artikel);
    return this.artikel;
  }

  previous() {
    this.artikel = this.inventarService.previousFor(this.artikel);
    return this.artikel;
  }
}

