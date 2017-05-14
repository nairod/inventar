import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { DatabaseService } from './database.service';
import { Artikel } from '../models/artikel';

@Injectable()
export class InventarService {
  private _kategorien: string[] =
  ['Anhänger', 'Perlenkette', 'Edelsteine ', 'Eheringe', 'Kinderketteli',
    'Ring', 'Ohrschmuck', 'Collier', 'Armkette'];

  private printSettings: Electron.PrintToPDFOptions =
  {
    landscape: false,
    marginsType: 1,
    printBackground: false,
    printSelectionOnly: false,
    pageSize: 'A4',
  };

  constructor(private _databaseService: DatabaseService, private _electronService: ElectronService) { }


  get kategorien(): string[] {
    return this._kategorien;
  }

  public openInventar(): void {
    const folder = this.getFolder();
    console.log(folder);
    this._databaseService.openDatabase(folder);
    this._databaseService.loadAll();
  }

  private getFolder(): string {
    return this._electronService.remote.dialog.showOpenDialog({
      title: 'Ordner auswählen',
      properties: ['openDirectory']
    })[0];
  };

  private getFile(): string {
    return this._electronService.remote.dialog.showOpenDialog({
      title: 'Datei auswählen',
      properties: ['openFile']
    })[0];
  };

  private createImage(photo: string) {
    const nativeImage = this._electronService.remote.require('electron').nativeImage;
    let image = nativeImage.createFromPath(photo);
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

  public loadPhotos(): void {
    const recursiveReadSync = this._electronService.remote.require('recursive-readdir-sync');

    const sourcePath = this.getFolder();
    const photos_on_disk: string[] = recursiveReadSync(sourcePath);

    for (let photo of photos_on_disk) {

      let resizedImage = this.createImage(photo);

      const artikel: Artikel = new Artikel(undefined, undefined, undefined, 0, 0, resizedImage.toDataURL());

      this._databaseService.insert(artikel);
      console.log(photo + ' inserted');
    }
    this._databaseService.loadAll();
  }

  public importDatabase(): void {
    const file = this.getFile();
    console.log('import: ' + file);
    this._databaseService.importDatabaseFile(file, false);
  }

  public exportDatabase(): void {
    const file = this.getFile();
    console.log('export: ' + file);
    this._databaseService.exportDatabaseFile(file);
  }

  public print() {
    const file: string = this.getFile();
    const fs = this._electronService.remote.require('fs');
    this._electronService.remote.webContents.getFocusedWebContents().printToPDF(this.printSettings, (err, data) => {
      if (err) {
        // dialog.showErrorBox('Error', err);
        return;
      }
      fs.writeFile(file, data, function (err1) {
        if (err1) {
          // dialog.showErrorBox('Error', err);
          return;
        }
      });
    });
  }

}
