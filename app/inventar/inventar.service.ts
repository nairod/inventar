import { ReplaySubject, Observable } from 'rxjs/Rx';
import { ResultFunc } from 'rxjs/observable/GenerateObservable';
import { Injectable, ValueProvider } from '@angular/core';
import * as Datastore from 'nedb';
import { ElectronService } from 'ngx-electron';
import { DatabaseService } from './database.service';

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

  constructor(private _databaseService: DatabaseService, private _electronService: ElectronService) {
  }


  get kategorien(): string[] {
    return this._kategorien;
  }

  public openInventar() {
    const folder = this.getFolder();
    console.log(folder);
    this._databaseService.openDatabase(folder);
    this._databaseService.loadAll();
  }

  private getFolder(): string {
    return this._electronService.remote.dialog.showOpenDialog({
      title: 'Select a folder',
      properties: ['openDirectory']
    })[0];
  };

}
