import { ResultFunc } from 'rxjs/observable/GenerateObservable';
import { Injectable, ValueProvider } from '@angular/core';
import * as Datastore from 'nedb';

let remote = require('electron').remote;


export class Artikel {
  constructor(
    public _id: string,
    public name: string,
    public kategorie: string,
    public einstandspreis: number,
    public verkaufspreis: number,
    public imagePath: string) { }
}


@Injectable()
export class InventarService {
  private inventarDB: Datastore;
  private inventarliste: Array<Artikel>;

  private _kategorien: string[] =
  ['Anhänger', 'Perlenkette', 'Edelsteine ', 'Eheringe', 'Kinderketteli',
    'Ring', 'Ohrschmuck', 'Collier', 'Armkette'];

  constructor() {
    this.inventarDB = remote.getGlobal('datastore');
    this.getInventarliste()
      .then(inventarliste => this.inventarliste = inventarliste);
  }

  get kategorien(): string[] {
    return this._kategorien;
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
      return this.inventarDB.findOne({ _id: id }, ((err: Error, artikel: Artikel) => {
        if (err) {
          reject(err);
        } else {
          console.log('Got', artikel.name);
          resolve(artikel);
        }
      }));
    });
  }


  public nextFor(artikel: Artikel) {
    let ix = this.inventarliste.findIndex(arti => arti._id === artikel._id);
    if (ix === (this.inventarliste.length - 1)) {
      ix = 0;
    } else {
      ix++;
    }
    return this.inventarliste[ix];
  }

  public previousFor(artikel: Artikel) {
    let ix = this.inventarliste.findIndex(arti => arti._id === artikel._id);
    if (ix === 0) {
      ix = (this.inventarliste.length - 1);
    } else {
      ix--;
    }
    return this.inventarliste[ix];
  }

  public update(artikel: Artikel) {
    this.inventarDB.update({ _id: artikel._id },
      {
        $set: {
          name: artikel.name,
          kategorie: artikel.kategorie,
          einstandspreis: artikel.einstandspreis,
          verkaufspreis: artikel.verkaufspreis
        }
      },
      {
        multi: true
      },
      (err: Error, numReplaced: number) => {
        if (err) {
          // TODO: handle error
        } else {
          console.log('updated', artikel.name);
        }
      });
  }
}
