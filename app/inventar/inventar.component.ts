import { Component } from '@angular/core';

import { InventarService } from './inventar.service';

@Component({
  template: `
    <h2>Inventarliste</h2>
    <nav>
    <a highlight routerLink=""  routerLinkActive="active">Inventarliste</a>
    </nav>
    <router-outlet></router-outlet>
  `,
  providers: [InventarService]
})
export class InventarComponent {
}
