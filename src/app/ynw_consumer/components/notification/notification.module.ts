import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './notification.component';
import { MatDialogModule } from '@angular/material/dialog';
import { HeaderModule } from '../../../shared/modules/header/header.module';
import { RouterModule, Routes } from '@angular/router';
import { TelegramPopupModule } from './telegrampopup/telegrampopup.module';
const routes: Routes = [
  { path: '', component: NotificationComponent }
];
@NgModule({
  declarations: [
    NotificationComponent
  ],
  imports: [
    CommonModule,
    HeaderModule,
    MatDialogModule,
    TelegramPopupModule,
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
