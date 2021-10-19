import { UserServiceChnageComponent } from './user-service-change.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { LoadingSpinnerModule } from '../loading-spinner/loading-spinner.module';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmBoxModule } from '../../../business/shared/confirm-box/confirm-box.module';
import { ConfirmBoxLocationModule } from './confirm-box-location/confirm-box-location.module';
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
  { path: '', component: UserServiceChnageComponent },
];
@NgModule({
    imports: [
      MatTableModule,
      MatCheckboxModule,
      CommonModule,
      MatFormFieldModule,
      MatInputModule,
      FormsModule,
      LoadingSpinnerModule,
      MatDialogModule,
      ConfirmBoxModule,
      ConfirmBoxLocationModule,
      [RouterModule.forChild(routes)]
    ],
    declarations: [
       UserServiceChnageComponent 
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
      ],
})
export class UserServiceChangeModule { }
