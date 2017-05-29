import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { DatabaseService } from './database.service';
import { Artikel } from '../models/artikel';
import * as Datastore from 'nedb';

@Injectable()
export class InventarService {
  private _kategorien: string[] =
  ['Anhänger', 'Perlenkette', 'Edelsteine ', 'Eheringe', 'Kinderketteli',
    'Ring', 'Ohrschmuck', 'Collier', 'Armkette', 'importierte Fotos'];

  private printSettings: Electron.PrintToPDFOptions =
  {
    landscape: false,
    marginsType: 2,
    printBackground: false,
    printSelectionOnly: false,
    pageSize: 'A4',
  };

  constructor(private _databaseService: DatabaseService, private _electronService: ElectronService) { }


  get kategorien(): string[] {
    return this._kategorien;
  }


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
          const photos_on_disk: string[] = recursiveReadSync(sourcePath);

          for (const photo of photos_on_disk) {
            const resizedImage = this.createImage(photo);
            const artikel: Artikel = new Artikel(undefined, undefined, "importierte Fotos", 0, 0, resizedImage.toDataURL());
            this._databaseService.insert(artikel);
            console.log(photo + ' inserted');
          }
          resolve(photos_on_disk);
        }
        else {
          resolve([]);
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
      return Promise.resolve(new Array<Artikel>());
    }
  }

  public exportDatabase(): Promise<string> {
    return new Promise((resolve, reject) => {
      const file = this.getFile();
      if (file != null) {
        try {
          this._databaseService.exportDatabaseFile(file[0]);
          console.log('export: ' + file[0]);
          resolve(file[0]);
        }
        catch (e) {
          resolve("Es ist ein unerwarteter Fehler aufgetreten" + e);
        }
      }
      resolve('');
    });
  }

  public print(): Promise<string> {
    return new Promise((resolve, reject) => {
      const file: string[] = this.getFile();
      if (file == null) {
        resolve('Ungueltige Eingabe');
      }
      const fs = this._electronService.remote.require('fs');
      this._electronService.remote.webContents.getFocusedWebContents().printToPDF(this.printSettings,
        (err, data) => {
          if (err) {
            // dialog.showErrorBox('Error', err);
            reject(err.message);
          }
          fs.writeFile(file[0], data, (err1) => {
            if (err1) {
              reject("error while creating file");
            }
          });
          resolve("PDF " + file + " erfolgreich erstellt.");
        });
    });
  }
}
