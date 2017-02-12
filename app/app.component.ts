import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  // template: `<router-outlet></router-outlet>`

  template: `
      <nav>
        <a routerLink=""  routerLinkActive="active">Inventarliste</a>
      </nav>
      <router-outlet></router-outlet>
    `

})
export class AppComponent {
}
