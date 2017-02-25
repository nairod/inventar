import { ResultFunc } from 'rxjs/observable/GenerateObservable';
import { Injectable, ValueProvider } from '@angular/core';
import * as Datastore from 'nedb';

let remote = require('electron').remote;


export class Artikel {
  constructor(
    public _id: string,
    public Name: string,
    public Kategorie: string,
    public Einstandpreis: number,
    public Verkaufspreis: number,
    public imagePath: string) { }
}


@Injectable()
export class InventarService {
  private inventarDB: Datastore;
  private inventarliste: Array<Artikel>;

  private _Kategorien: string[] = ['Eheringe', 'Schmuckringe', 'Halsketten'];

  constructor() {
    this.inventarDB = remote.getGlobal('datastore');
    this.getInventarliste()
      .then(inventarliste => this.inventarliste = inventarliste);
  }

  get Kategorien(): string[] {
    return this._Kategorien;
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
          console.log('Got', artikel.Name);
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
          Name: artikel.Name,
          Kategorie: artikel.Kategorie,
          Einstandpreis: artikel.Einstandpreis,
          Verkaufspreis: artikel.Verkaufspreis
        }
      },
      {
        multi: true
      },
      (err: Error, numReplaced: number) => {
        if (err) {
          // TODO: handle error
        } else {
          console.log('updated', artikel.Name);
        }
      });
  }
}
