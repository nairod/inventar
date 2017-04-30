import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { InventarComponent } from './inventar.component';
import { ArtikelComponent } from './artikel/artikel.component';
import { InventarlisteComponent } from './inventarliste/inventarliste.component';
import { InventarRoutingModule } from './inventar-routing.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MaterialModule } from '@angular/material';


@NgModule({
  imports: [SharedModule, InventarRoutingModule, NgxDatatableModule, MaterialModule],
  declarations: [
    InventarComponent, ArtikelComponent, InventarlisteComponent,
  ]
})
export class InventarModule { }
