import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { InventarComponent } from './inventar.component';
import { ArtikelComponent } from './artikel.component';
import { InventarlisteComponent } from './inventarliste.component';
import { InventarRoutingModule } from './inventar-routing.module';


@NgModule({
  imports: [SharedModule, InventarRoutingModule],
  declarations: [
    InventarComponent, ArtikelComponent, InventarlisteComponent,
  ]
})
export class InventarModule { }
