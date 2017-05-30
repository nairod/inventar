import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventarComponent } from './inventar.component';
import { ArtikelComponent } from './artikel/artikel.component';
import { InventarlisteComponent } from './inventarliste/inventarliste.component';
import { ArtikelDeleteDialog } from './artikel/artikel-delete.component';
import { InventarRoutingModule } from './inventar-routing.module';
import { MaterialModule } from '@angular/material';


@NgModule({
  imports: [InventarRoutingModule, MaterialModule, FormsModule, CommonModule],
  declarations: [
    InventarComponent, ArtikelComponent, InventarlisteComponent, ArtikelDeleteDialog
  ],
  entryComponents: [ArtikelDeleteDialog]
})
export class InventarModule { }
