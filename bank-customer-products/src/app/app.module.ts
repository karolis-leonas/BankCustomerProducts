import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './modules/app-routing.module';
import { DynamicWindowComponent } from './components/dynamic-window/dynamic-window.component';
import { SubmitWindowComponent } from './components/submit-window/submit-window.component';
import { DataService } from './services/data.service';
import { ProductsTableComponent } from './components/products-table/products-table.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent, SubmitWindowComponent, DynamicWindowComponent, ProductsTableComponent],
  imports: [BrowserModule, HttpClientModule, ReactiveFormsModule, AppRoutingModule, FormsModule],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule {}
