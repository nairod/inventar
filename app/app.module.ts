import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxElectronModule } from 'ngx-electron';

/* App Root */
import { AppComponent } from './app.component';

import { AppRoutingModule } from './app-routing.module';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MaterialModule } from '@angular/material';
import { RouteReuseStrategy } from '@angular/router';
import { CustomReuseStrategy } from './reuse-strategy';

@NgModule({
  imports: [
    AppRoutingModule,
    CommonModule,
    NgbModule.forRoot(),
    NgxDatatableModule,
    MaterialModule,
    NgxElectronModule,
    BrowserAnimationsModule
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],

  providers: [
    { provide: RouteReuseStrategy, useClass: CustomReuseStrategy }
  ]

})
export class AppModule { }


/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
