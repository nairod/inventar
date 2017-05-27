import { BehaviorSubject, Observable } from 'rxjs/Rx';
import { Injectable, NgZone } from '@angular/core';
import * as Datastore from 'nedb';

import { ElectronService } from 'ngx-electron';
import { Artikel } from '../models/artikel';


@Injectable()
export class DatabaseService {
  artikelObservable: Observable<Artikel[]>;
  private _artikelSubject: BehaviorSubject<Artikel[]>;
  private artikelStore: {
    liste: Artikel[];
  };
  private inventarDB: Datastore;
  private dbPath: string;

  constructor(private _electronService: ElectronService, private _ngZone: NgZone) {
    this.artikelStore = { liste: [] };
    this._artikelSubject = <BehaviorSubject<Artikel[]>>new BehaviorSubject([]);
    this.artikelObservable = this._artikelSubject.asObservable();
    console.log('BehaviorSubject', this._artikelSubject);
    console.log('Observable', this.artikelObservable);
  }

  openDatabase(): DatabaseService {
    this.dbPath = this._electronService.remote.app.getPath('userData');
    console.log(this._electronService.remote.app.getPath('userData'));
    const db = new Datastore({
      filename: this.dbPath + '/inventarBig.nedb',
      autoload: true
    });
    /*
    db.ensureIndex({
      fieldName: 'imagePath',
      unique: true
    });
    */
    this.inventarDB = db;
    return this;
  }

  importDatabaseFile(dbFileName: string, legacy: boolean): Promise<Artikel[]> {
    return new Promise((resolve, reject) => {
      const nativeImage = this._electronService.remote.require('electron').nativeImage;
      const Datastore = this._electronService.remote.require('nedb'),
        db: Datastore = new Datastore({
          filename: dbFileName,
          autoload: true
        });
      this._ngZone.run(() => {
        db.find<Artikel>({}, (e, docs) => {
          if (!e) {
            for (let importedArtikel of docs) {
              // TODO: auslagern da Duplikat in inventarservice, imagepath in imagedataurl umbenennen
              if (legacy) {
                let image = nativeImage.createFromPath(importedArtikel.imagePath);
                if (!image.isEmpty()) {
                  let resizedImage = image.resize({ width: 400 });
                  importedArtikel.imagePath = resizedImage.toDataURL();
                } else {
                  reject('bild konnte nicht geladen werden: ' + importedArtikel.imagePath);
                  console.log('bild konnte nicht geladen werden: ' + importedArtikel.imagePath);
                }
              }
              this.inventarDB.insert(importedArtikel);
              console.log('inserted artikel: ' + importedArtikel);
              resolve(this.loadAll());
            }
          } else {
            reject(e);
            console.error('unable to load database', e);
          }
        });
      });
    });
  }
  exportDatabaseFile(toFileName: string): void {
    const Datastore = this._electronService.remote.require('nedb'),
      exportDB: Datastore = new Datastore({
        filename: toFileName,
        autoload: true
      });
    this.inventarDB.find<Artikel>({}, (e, docs) => {
      if (!e) {
        for (let artikel of docs) {
          exportDB.insert(artikel);
          console.log('exported artikel: ' + artikel);
        }
      }
    });
  }

  loadAll(): Promise<Artikel[]> {
    return new Promise((resolve, reject) => {
      this._ngZone.run(() => {
        this.inventarDB.find<Artikel>({}, (e, docs) => {
          if (!e) {
            this.artikelStore.liste = docs;
            this._artikelSubject.next(this.artikelStore.liste);
            console.log('dbservice subject', this._artikelSubject);
            console.log('dbservice items', this.artikelObservable);
            resolve(docs);
          }
          else {
            reject(e);
            console.log('Failed to load artikelliste');
          }
        });
      });
    });
  }

  loadByKategorie(kategorien: string[]): void {
    this._ngZone.run(() => {
      this.inventarDB.find<Artikel>({ kategorie: kategorien }, (e, docs) => {
        if (!e) {
          this.artikelStore.liste = docs;
          this._artikelSubject.next(this.artikelStore.liste);
          console.log('dbservice subject', this._artikelSubject);
          console.log('dbservice items', this.artikelObservable);
        }
      });
    });
  }


  public getArtikel(id: number | string): Promise<Artikel> {
    return new Promise((resolve, reject) => {
      return this.inventarDB.findOne({ _id: id }, ((err: Error, artikel: Artikel) => {
        if (err) {
          reject(err);
          console.log('Failed to load', artikel.name);
        } else {
          console.log('Got', artikel.name);
          resolve(artikel);
        }
      }));
    });
  }

  public update(artikel: Artikel) {
    this.inventarDB.update({ _id: artikel._id },
      {
        $set: {
          name: artikel.name,
          kategorie: artikel.kategorie,
          einstandspreis: artikel.einstandspreis,
          verkaufspreis: artikel.verkaufspreis,
          imagePath: artikel.imagePath
        }
      },
      {
        multi: false
      },
      (err: Error, numReplaced: number) => {
        if (err) {
          console.log('error storing ', artikel.name);
        } else {
          console.log('updated ', artikel.name);
        }
      });
  }
  public delete(id: number | string) {
    const index = this.artikelStore.liste.findIndex(arti => arti._id === id);
    if (index > -1) {
      this.artikelStore.liste.splice(index, 1);
    }
    this._artikelSubject.next(this.artikelStore.liste);

    this.inventarDB.remove({ _id: id }, {}, function (err, numRemoved) {
    });
  }

  public insert(artikel: Artikel) {
    this.inventarDB.insert<Artikel>(artikel, (err: Error, doc: Artikel) => {
      if (!err) {
        console.log('inserted artikel with id ' + doc._id);
      } else {
        console.log('failed to insert artikel');
      }
    });
  }

  public deleteAll() {
    this.inventarDB.remove({}, { multi: true }, function (err, numRemoved) {
      /*this.inventarDB.loadDatabase(function (err1) {
        // done
      });*/
    });
    this.loadAll();
  }

  public nextFor(artikel: Artikel) {
    let ix = this.artikelStore.liste.findIndex(arti => arti._id === artikel._id);
    if (ix === (this.artikelStore.liste.length - 1)) {
      ix = 0;
    } else {
      ix++;
    }
    return this.artikelStore.liste[ix];
  }

  public previousFor(artikel: Artikel) {
    let ix = this.artikelStore.liste.findIndex(arti => arti._id === artikel._id);
    if (ix === 0) {
      ix = (this.artikelStore.liste.length - 1);
    } else {
      ix--;
    }
    return this.artikelStore.liste[ix];
  }

}
