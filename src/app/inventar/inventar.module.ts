import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventarComponent } from './inventar.component';
import { ArtikelComponent } from './artikel/artikel.component';
import { InventardruckComponent } from './inventardruck/inventardruck.component';
import { InventarRoutingModule } from './inventar-routing.module';
import { MaterialModule } from '@angular/material';


@NgModule({
  imports: [InventarRoutingModule, MaterialModule, FormsModule, CommonModule],
  declarations: [
    InventarComponent, ArtikelComponent, InventardruckComponent,
  ]
})
export class InventarModule { }
