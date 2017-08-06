import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import {AppComponent, TomatoSelectDialog} from './app.component';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import 'hammerjs';
import {MdButtonModule, MdDialogModule} from '@angular/material';

@NgModule({
  declarations: [
    AppComponent,
    TomatoSelectDialog
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MdButtonModule,
    MdDialogModule
  ],
  entryComponents: [TomatoSelectDialog],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
