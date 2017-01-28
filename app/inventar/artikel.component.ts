import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {
  Artikel,
  InventarService
} from './inventar.service';

@Component({
  templateUrl: './app/inventar/artikel.component.html'
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

