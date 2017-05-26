import { NgModule } from '@angular/core';
import {
  Routes,
  RouterModule
} from '@angular/router';

import { InventarComponent } from './inventar.component';
import { InventardruckComponent } from './inventardruck/inventardruck.component';
import { ArtikelComponent } from './artikel/artikel.component';

const routes: Routes = [
  {
    path: '',
    component: InventarComponent,
    children: [
      { path: 'new', component: ArtikelComponent },
      { path: 'print', component: InventardruckComponent },
      { path: ':id', component: ArtikelComponent },
      { path: '', component: InventardruckComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class InventarRoutingModule { }
