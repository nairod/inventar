import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { DatabaseService } from './database.service';
import { Artikel } from '../models/artikel';
import * as Datastore from 'nedb';
import * as Path from 'path';


@Injectable()
export class InventarService {
  private printSettings: Electron.PrintToPDFOptions =
  {
    landscape: false,
    marginsType: 2,
    printBackground: false,
    printSelectionOnly: false,
    pageSize: 'A4',
  };

  constructor(private _databaseService: DatabaseService, private _electronService: ElectronService) { }
  private getFolder(): string[] {
    return this._electronService.remote.dialog.showOpenDialog({
      title: 'Ordner auswählen',
      properties: ['openDirectory']
    });
  };

  private getFile(): string[] {
    return this._electronService.remote.dialog.showOpenDialog({
      title: 'Datei auswählen',
      properties: ['openFile']
    });
  };

  private createImage(photo: string) {
    const nativeImage = this._electronService.remote.require('electron').nativeImage;
    const image = nativeImage.createFromPath(photo);
    return image.resize({ width: 600 });
  }

  public addPhoto() {
    const photoPath: string = this._electronService.remote.dialog.showOpenDialog({
      title: 'Foto auswählen',
      properties: ['openFile'],
      filters: [{ name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif'] }]
    })[0];
    return this.createImage(photoPath).toDataURL();
  }

  public loadPhotos(): Promise<String[]> {
    return new Promise((resolve, reject) => {
      try {
        const recursiveReadSync = require('recursive-readdir-sync');
        const sourcePath = this.getFolder();
        if (sourcePath !== undefined) {
          const photos_on_disk: string[] = recursiveReadSync(sourcePath[0]);

          for (const photo of photos_on_disk) {
            const resizedImage = this.createImage(photo);
            const artikel: Artikel = new Artikel(undefined, undefined, Path.basename(Path.dirname(photo)), 0, 0, resizedImage.toDataURL());
            this._databaseService.insert(artikel);
            console.log(photo + ' inserted');
          }
          resolve(photos_on_disk);
        }
        else {
          reject('Es wurde kein Ordner ausgewählt');
        }
      }
      catch (e) {
        reject(e);
      }
    });
  }

  public importDatabase(): Promise<Artikel[]> {
    const file = this.getFile();
    if (file != null) {
      console.log('import: ' + file);
      return this._databaseService.importDatabaseFile(file[0], false);
    } else {
      return Promise.reject('Es wurde kein File ausgewählt.');
    }
  }

  public exportDatabase(): Promise<string> {
    return new Promise((resolve, reject) => {
      const file = this.getFolder();
      if (file != null) {
        try {
          const fileName = file[0] + '/inventar.json';
          this._databaseService.exportDatabaseFile(fileName);
          console.log('export: ' + fileName);
          resolve(fileName);
        }
        catch (e) {
          reject("Es ist ein unerwarteter Fehler aufgetreten: " + e);
        }
      }
      reject('Es wurde kein File ausgewählt.');
    });
  }

  public print(): Promise<string> {
    return new Promise((resolve, reject) => {
      const file: string[] = this.getFolder();
      if (file == null) {
        resolve('Ungueltige Eingabe');
      }
      const fileName = file[0] + '/inventar.pdf';
      const fs = this._electronService.remote.require('fs');
      this._electronService.remote.webContents.getAllWebContents().pop().printToPDF(this.printSettings,
        (err, data) => {
          if (err) {
            reject(err.message);
          }
          fs.writeFile(fileName, data, (err1) => {
            if (err1) {
              reject("error while creating file. " + err1);
            }
          });
          resolve("PDF " + fileName + " erfolgreich erstellt.");
        });
    });
  }
}
