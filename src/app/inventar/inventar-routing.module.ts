import { NgModule } from '@angular/core';
import {
  Routes,
  RouterModule
} from '@angular/router';

import { InventarComponent } from './inventar.component';
import { InventarlisteComponent } from './inventarliste/inventarliste.component';
import { ArtikelComponent } from './artikel/artikel.component';

const routes: Routes = [
  {
    path: '',
    component: InventarComponent,
    children: [
      { path: 'new', component: ArtikelComponent },
      { path: 'print', component: InventarlisteComponent },
      { path: ':id', component: ArtikelComponent },
      { path: '', component: InventarlisteComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class InventarRoutingModule { }
