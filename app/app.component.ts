import { Component } from '@angular/core';
import { InventarService } from './inventar/services/inventar.service';
import { DatabaseService } from './inventar/services/database.service';

@Component({
  selector: 'my-app',
  templateUrl: './app/app.component.html',
  providers: [InventarService, DatabaseService]
})
export class AppComponent {

  constructor(private _inventarService: InventarService, private _dbService: DatabaseService) {

  }

  public loadPhotos() {
    this._inventarService.loadPhotos();
  }

  public importDatabase() {
    this._inventarService.importDatabase();
  }
  public exportDatabase() {
    this._inventarService.exportDatabase();
  }

  public deleteAll() {
    this._dbService.deleteAll();
  }
}
