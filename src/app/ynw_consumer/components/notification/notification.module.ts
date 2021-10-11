import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './notification.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderModule } from '../../../shared/modules/header/header.module';
import { TelegramPopupComponent } from './telegrampopup/telegrampopup.component';
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
  { path: '', component: NotificationComponent }
];
@NgModule({
  declarations: [
    NotificationComponent,
    TelegramPopupComponent
  ],
  imports: [
    CommonModule,
    HeaderModule,
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule,
    [RouterModule.forChild(routes)]
  ],
  exports: [
    NotificationComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
})
export class NotificationModule { }
