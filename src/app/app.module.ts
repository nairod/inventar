import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';

import { NgxElectronModule } from 'ngx-electron';
import { MaterialModule } from '@angular/material';
import { AppRoutingModule } from './app-routing.module';
import { CustomReuseStrategy } from './reuse-strategy';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    NgxElectronModule,
    BrowserAnimationsModule,
    FormsModule,
    MaterialModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: CustomReuseStrategy }],
  bootstrap: [AppComponent]
})
export class AppModule { }
