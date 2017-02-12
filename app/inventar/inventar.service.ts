import { ResultFunc } from 'rxjs/observable/GenerateObservable';
import { Injectable, ValueProvider } from '@angular/core';
import * as Datastore from 'nedb';

let remote = require('electron').remote;


export class Artikel {
  constructor(
    public _id: string,
    public name: string,
    public kategorie: string,
    public einstandpreis: number,
    public verkaufspreis: number,
    public imagePath: string) { }
}


@Injectable()
export class InventarService {
  private inventarDB: Datastore;
  private currentArtikel: Artikel;
  private inventarliste: Array<Artikel>;

  private _kategorien: string[] = ['Eheringe', 'Schmuckringe', 'Halsketten'];

  constructor() {
    this.inventarDB = remote.getGlobal('datastore');

    this.getInventarliste().then(inventarliste => this.inventarliste = inventarliste
    ).then(inventarliste => this.currentArtikel = inventarliste[0]);
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

  public update(artikel: Artikel) {
    this.inventarDB.update({ _id: artikel._id },
      {
        $set: {
          name: artikel.name,
          kategorie: artikel.kategorie,
          einstandpreis: artikel.einstandpreis,
          verkaufspreis: artikel.verkaufspreis
        }
      },
      {
        multi: true
      },
      function (err, numReplaced) {
      });

  }
}
