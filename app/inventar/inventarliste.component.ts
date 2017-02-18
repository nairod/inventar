import { Component, OnInit } from '@angular/core';



import {
  Artikel,
  InventarService
} from './inventar.service';


@Component({
  templateUrl: './app/inventar/inventarliste.component.html'
})


export class InventarlisteComponent implements OnInit {
  rows = [
    { name: 'Austin', gender: 'Male', company: 'Swimlane' },
    { name: 'Dany', gender: 'Male', company: 'KFC' },
    { name: 'Molly', gender: 'Female', company: 'Burger King' },
  ];
  columns = [
    { prop: 'name' },
    { name: 'Gender' },
    { name: 'Company' }
  ];

  inventarliste: Promise<Artikel[]>;
  constructor(private inventarService: InventarService) { }


  ngOnInit() {
    this.inventarliste = this.inventarService.getInventarliste();
  }
}
