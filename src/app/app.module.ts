import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ImportPageComponent } from './import-page/import-page.component';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
  import { FileUploadModule } from 'primeng/fileupload';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TabMenuModule } from 'primeng/tabmenu';
import { TabViewModule } from 'primeng/tabview';
import { NgxSpinnerModule } from "ngx-spinner";
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { ExelDetailsComponent } from './components/exel-details/exel-details.component';
import { AnomaliesComponent } from './components/anomalies/anomalies.component';
import { ExelDetails700Component } from './components/exel-details-700/exel-details-700.component';

@NgModule({
  declarations: [
    AppComponent,
    ImportPageComponent,
    ExelDetailsComponent,
    AnomaliesComponent,
    ExelDetails700Component
  ],
  imports: [
    BrowserModule,
    TabViewModule,
    ConfirmDialogModule,
    CalendarModule,
    ReactiveFormsModule,
    ToastModule,
    FormsModule,
    NgxSpinnerModule,
    TabMenuModule,
    InputTextModule,
    FileUploadModule,
    AppRoutingModule,
    FieldsetModule,
    HttpClientModule,
    CardModule,
    BrowserAnimationsModule,
    DialogModule,
    DropdownModule,
    TableModule,
     BrowserModule,
     ButtonModule,

  ],
  providers: [MessageService,ConfirmationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
