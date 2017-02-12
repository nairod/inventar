import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {
  Artikel,
  InventarService
} from './inventar.service';

@Component({
  templateUrl: './app/inventar/artikel.component.html',
  styleUrls: ['./app/inventar/artikel.component.css']
})

export class ArtikelComponent implements OnInit {
  artikel: Artikel;
  kategorien: string[];

  submitted = false;
  onSubmit() {
    this.submitted = true;
    this.inventarService.update(this.artikel);
  }

  // TODO: Remove this when we're done
  get diagnostic() { return JSON.stringify(this.artikel); }

  constructor(
    private route: ActivatedRoute,
    private inventarService: InventarService) { }

  ngOnInit() {
    this.kategorien = this.inventarService.kategorien;
    this.next();
  }

  next() {
    this.artikel = this.inventarService.next();
    return this.artikel;
  }

  previous() {
    this.artikel = this.inventarService.previous();
    return this.artikel;
  }
}

