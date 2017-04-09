import { Injectable } from '@angular/core';
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
  private _kategorien: string[] =
  ['Anhänger', 'Perlenkette', 'Edelsteine ', 'Eheringe', 'Kinderketteli',
    'Ring', 'Ohrschmuck', 'Collier', 'Armkette'];

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
      title: 'Select a folder',
      properties: ['openDirectory']
    })[0];
  };

  private getFile(): string {
    return this._electronService.remote.dialog.showOpenDialog({
      title: 'Inventar Datenbank auswählen',
      properties: ['openFile']
    })[0];
  };

  public loadPhotos(): void {
    const fs = this._electronService.remote.require('fs');

    const sourcePath = this.getFolder();
    const photos_on_disk: string[] = fs.readdirSync(sourcePath);

    //    let userDataPath = this._electronService.remote.app.getPath('userData');
    // let targetPath = userDataPath + '/inventarData/' + this.generateUUID();

    //this.createDir(targetPath);

    for (let photo of photos_on_disk) {

      const nativeImage = this._electronService.remote.require('electron').nativeImage;
      let image = nativeImage.createFromPath(sourcePath + '/' + photo);
      let resizedImage = image.resize({ width: 600 });
      //let id: string = this.generateUUID();
      //let photoName = id + '.png';


      //    let fullPath = targetPath + '/' + photoName;
      //fs.writeFileSync(fullPath, resizedImage.toPng());

      const artikel: Artikel = new Artikel(undefined, undefined, undefined, 0, 0, resizedImage.toDataURL());

      this._databaseService.insert(artikel);
      console.log(photo + ' inserted');
    }
  }

  public importDatabase(): void {
    const file = this.getFile();
    console.log('import: ' + file);
    this._databaseService.importDatabaseFile(file, false);
  }

  public exortDatabase(): void {
    const file = this.getFile();
    console.log('export: ' + file);
    this._databaseService.exportDatabaseFile(file);
  }
  /*
    generateUUID() {
      let time = new Date().getTime();
      const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (time + Math.random() * 16) % 16 | 0;
        time = Math.floor(time / 16);
        return (c === 'x' ? r : (r & 0x7 | 0x8)).toString(16);
      });
      return uuid.toUpperCase();
    }
  */
  createDir(dirname: string) {
    const fs = this._electronService.remote.require('fs.extra');
    try {
      fs.mkdirpSync(dirname);
    } catch (e) {
      throw e;
    }
  }
}
