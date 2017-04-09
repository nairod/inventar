import { BehaviorSubject, Observable } from 'rxjs/Rx';
import { Injectable, NgZone } from '@angular/core';
import * as Datastore from 'nedb';

import { ElectronService } from 'ngx-electron';
import { Artikel } from './inventar.service';


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

  openDatabase(folderName: string): DatabaseService {
    this.dbPath = folderName;
    const db = new Datastore({
      filename: folderName + '/inventarBig.nedb',
      autoload: true
    });
    db.ensureIndex({
      fieldName: 'imagePath',
      unique: true
    });
    this.inventarDB = db;
    return this;
  }

  importDatabaseFile(dbFileName: string, legacy: boolean): void {
    const nativeImage = this._electronService.remote.require('electron').nativeImage;
    const Datastore = this._electronService.remote.require('nedb'),
      db: Datastore = new Datastore({
        filename: dbFileName,
        autoload: true
      });

    db.find<Artikel>({}, (e, docs) => {
      if (!e) {
        for (let importedArtikel of docs) {
          // TODO: auslagern da Duplikat in inventarservice, imagepath in imagedataurl umbenennen
          if (legacy) {
            let image = nativeImage.createFromPath(importedArtikel.imagePath);
            let resizedImage = image.resize({ width: 400 });
            importedArtikel.imagePath = resizedImage.toDataURL();
          }
          this.inventarDB.insert(importedArtikel);
          console.log('inserted artikel: ' + importedArtikel);
        }
      }
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

  loadAll(): void {
    console.log('liste ', this.artikelStore.liste);
    console.log('db ', this.inventarDB);
    console.log('obs ', this.artikelObservable);
    if (this.inventarDB) {
      this._ngZone.run(() => {
        this.inventarDB.find<Artikel>({}, (e, docs) => {
          if (!e) {
            this.artikelStore.liste = docs;
            this._artikelSubject.next(this.artikelStore.liste);
            console.log('dbservice subject', this._artikelSubject);
            console.log('dbservice items', this.artikelObservable);
          }
        });
      });
    }
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

  public insert(artikel: Artikel) {
    this.inventarDB.insert<Artikel>(artikel);
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
