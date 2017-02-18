import { Component } from '@angular/core';

import { InventarService } from './inventar.service';

@Component({
  templateUrl: './app/inventar/inventar.component.html',
  providers: [InventarService]
})
export class InventarComponent {
}
