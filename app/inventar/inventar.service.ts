import { ResultFunc } from 'rxjs/observable/GenerateObservable';
import { Injectable } from '@angular/core';
import * as Datastore from 'nedb';

let remote = require('electron').remote;


export class Artikel {
  constructor(
    public name: string,
    public kategorie: string,
    public ep: number,
    public vp: number,
    public imagePath: string) { }
}

const INVENTARLISTE: Artikel[] = [
  new Artikel('Bernstein Ring', 'Ringe', 123.35, 230, 'bild.jpg'),
  new Artikel('Bernstein Ring2', 'Ringe', 124.35, 230, 'bild.jpg'),
  new Artikel('Bernstein Ring3', 'Ringe', 125.35, 230, 'bild.jpg'),
  new Artikel('Bernstein Ring4', 'Ringe', 126.35, 230, 'bild.jpg')
];



@Injectable()
export class InventarService {
  private inventarDB: Datastore;
  private currentArtikel: Artikel;
  private inventarliste: Array<Artikel>;

  constructor() {
    this.inventarDB = remote.getGlobal('datastore');

    this.getInventarliste().then(inventarliste => this.inventarliste = inventarliste
    ).then(inventarliste => this.currentArtikel = inventarliste[0]);
  }


  public getInventarliste(): Promise<Array<Artikel>> {
    return new Promise((resolve, reject) => {
      return this.inventarDB.find({}, ((err: Error, inventarliste: Array<Artikel>) => {
        if (err) {
          reject(err);
        } else {
          resolve(inventarliste);
        }
      }));
    });
  }

  public getArtikel(id: number | string): Promise<Artikel> {
    return new Promise((resolve, reject) => {
      return this.inventarDB.findOne({ id: id }, ((err: Error, artikel: Artikel) => {
        if (err) {
          reject(err);
        } else {
          console.log('Got', artikel.name);
          resolve(artikel);
        }
      }));
    });
  }


  public next() {
    let ix = this.inventarliste.indexOf(this.currentArtikel) + 1;
    if (ix >= this.inventarliste.length) { ix = 0; }
    this.currentArtikel = this.inventarliste[ix];
    return this.currentArtikel;
  }

  public previous() {
    let ix = this.inventarliste.indexOf(this.currentArtikel) - 1;
    if (ix <= 0) { ix = this.inventarliste.length; }
    this.currentArtikel = this.inventarliste[ix];
    return this.currentArtikel;
  }
}
