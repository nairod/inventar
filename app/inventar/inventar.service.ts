import { Injectable } from '@angular/core';
import * as Datastore from 'nedb';
let remote = require('electron').remote;


export class Artikel {
  constructor(
    public id: number,
    public name: string,
    public kategorie: string,
    public ep: number,
    public vp: number,
    public imagePath: string) { }
}

const INVENTARLISTE: Artikel[] = [
  new Artikel(11, 'Bernstein Ring', 'Ringe', 123.35, 230, 'bild.jpg'),
  new Artikel(12, 'Bernstein Ring2', 'Ringe', 124.35, 230, 'bild.jpg'),
  new Artikel(13, 'Bernstein Ring3', 'Ringe', 125.35, 230, 'bild.jpg'),
  new Artikel(14, 'Bernstein Ring4', 'Ringe', 126.35, 230, 'bild.jpg')
];



@Injectable()
export class InventarService {
  private inventarDB: Datastore;

  constructor() {
    this.inventarDB = remote.getGlobal('datastore');
    for (let artikel of INVENTARLISTE) {
      this.inventarDB.insert(artikel, function (err: any, doc: any) {
        console.log('Inserted', doc.name, 'with ID', doc._id);
      });
    }
  }


  getInventarliste(): Promise<Array<Artikel>> {
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
          console.log('Got', artikel.name, 'with ID', artikel.id);
          resolve(artikel);
        }
      }));
    });
  }

}
