import { Component } from '@angular/core';
import { InventarService } from './inventar/services/inventar.service';
import { DatabaseService } from './inventar/services/database.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [InventarService, DatabaseService]
})

export class AppComponent {
  workInProgress = false;
  progressName = '';
  constructor(private _inventarService: InventarService, private _dbService: DatabaseService) { }

  public loadPhotos() {
    this.workInProgress = true;
    this.progressName = 'Die Fotos werden importiert'
    this._inventarService.loadPhotos().then(() => this.clearProgress());
  }

  public importDatabase() {
    this.workInProgress = true;
    this.progressName = 'Die Datenbank wird importiert'
    this._inventarService.importDatabase().then(() => this.clearProgress());
  }
  public exportDatabase() {
    this.workInProgress = true;
    this.progressName = 'Die Datenbank wird exportiert'
    this._inventarService.exportDatabase().then(() => this.clearProgress());
  }

  public deleteAll() {
    this._dbService.deleteAll();
  }

  public print() {
    this.workInProgress = true;
    this.progressName = 'PDF wird generiert'
    this._inventarService.print().then((pdf) => {
      this.progressName = pdf;
      this.workInProgress = false;
      setTimeout(() => this.progressName = '', 5000);
    }
    );
  }

  private clearProgress() {
    this.workInProgress = false; this.progressName = ''
  };
}
