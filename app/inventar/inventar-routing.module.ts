import { NgModule } from '@angular/core';
import {
  Routes,
  RouterModule
} from '@angular/router';

import { InventarComponent } from './inventar.component';
import { InventarlisteComponent } from './inventarliste.component';
import { ArtikelComponent } from './artikel.component';

const routes: Routes = [
  {
    path: '',
    component: InventarComponent,
    children: [
      { path: '', component: InventarlisteComponent },
      { path: ':id', component: ArtikelComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class InventarRoutingModule { }
