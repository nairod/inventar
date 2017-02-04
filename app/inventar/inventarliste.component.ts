import { Component, OnInit } from '@angular/core';

import {
  Artikel,
  InventarService
} from './inventar.service';

@Component({
  templateUrl: './app/inventar/inventarliste.component.html'
})

export class InventarlisteComponent implements OnInit {
  inventarliste: Promise<Artikel[]>;
  constructor(private inventarService: InventarService) { }

  ngOnInit() {
    this.inventarliste = this.inventarService.getInventarliste();
  }
}
