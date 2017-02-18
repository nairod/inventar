import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { InventarComponent } from './inventar.component';
import { ArtikelComponent } from './artikel.component';
import { InventarlisteComponent } from './inventarliste.component';
import { InventarRoutingModule } from './inventar-routing.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';


@NgModule({
  imports: [SharedModule, InventarRoutingModule, NgxDatatableModule],
  declarations: [
    InventarComponent, ArtikelComponent, InventarlisteComponent,
  ]
})
export class InventarModule { }
