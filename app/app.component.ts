import { Component } from '@angular/core';
import { InventarService } from './inventar/inventar.service';
import { DatabaseService } from './inventar/database.service';

@Component({
  selector: 'my-app',
  templateUrl: './app/app.component.html',
  providers: [InventarService, DatabaseService]
})
export class AppComponent {

  constructor(private _inventarService: InventarService) {

  }

  public openInventar() {
    this._inventarService.openInventar();
  }
}
