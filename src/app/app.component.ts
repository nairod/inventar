import { Component } from '@angular/core';
import { InventarService } from './inventar/services/inventar.service';
import { DatabaseService } from './inventar/services/database.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [InventarService, DatabaseService]
})
export class AppComponent {

  constructor(private _inventarService: InventarService, private _dbService: DatabaseService) { }

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

  public print() {
    this._inventarService.print();
  }
}
