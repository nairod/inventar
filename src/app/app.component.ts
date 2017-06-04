import { Component } from '@angular/core';
import { InventarService } from './inventar/services/inventar.service';
import { DatabaseService } from './inventar/services/database.service';
import { CommonModule } from '@angular/common';
import { MdSnackBar } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [InventarService, DatabaseService]
})

export class AppComponent {
  workInProgress = false;
  progressName = '';
  constructor(private _inventarService: InventarService, private _dbService: DatabaseService, private snackBar: MdSnackBar) { }

  public loadPhotos() {
    this.workInProgress = true;
    this.progressName = 'Die Fotos werden importiert'
    this._inventarService.loadPhotos()
      .then(() => {
        this.clearProgress();
        this.snackBar.open('Die Fotos wurden erfolgreich importiert.', 'OK', { duration: 2000 });
      })
      .catch((e) => {
        this.clearProgress();
        this.snackBar.open('Die Fotos konnten nicht importiert werden. ' + e, 'FEHLER!', { duration: 3000 });
      });
  }

  public importDatabase() {
    this.workInProgress = true;
    this.progressName = 'Die Datenbank wird importiert'
    this._inventarService.importDatabase()
      .then(() => {
        this.clearProgress();
        this.snackBar.open('Die Datenbank wurde erfolgreich importiert.', 'OK', { duration: 2000 });
      })
      .catch((e) => {
        this.clearProgress();
        this.snackBar.open('Die Datenbank konnte nicht importiert werden. ' + e, 'FEHLER!', { duration: 3000 });
      });

  }
  public exportDatabase() {
    this.workInProgress = true;
    this.progressName = 'Die Datenbank wird exportiert'
    this._inventarService.exportDatabase()
      .then(() => {
        this.clearProgress();
        this.snackBar.open('Die Datenbank wurde erfolgreich exportiert.', 'OK', { duration: 2000 });
      })
      .catch((e) => {
        this.clearProgress();
        this.snackBar.open('Die Datenbank konnte nicht exportiert werden. ' + e, 'FEHLER!', { duration: 3000 });
      });
  }

  public deleteAll() {
    this._dbService.deleteAll();
  }

  public print() {
    this.workInProgress = true;
    this.progressName = 'PDF wird generiert'
    this._inventarService.print()
      .then((pdf) => {
        this.clearProgress();
        this.snackBar.open(pdf, 'OK', { duration: 5000 });
      })
      .catch((pdf) => {
        this.clearProgress();
        this.snackBar.open(pdf, 'FEHLER', { duration: 3000 });
      });
  }

  private clearProgress() {
    this.workInProgress = false; this.progressName = ''
  };
}
