import { Component } from '@angular/core';

import { InventarService } from './inventar.service';

@Component({
  template: `
    <h2>Inventarliste</h2>
    <router-outlet></router-outlet>
  `,
  providers: [InventarService]
})
export class InventarComponent {
}
