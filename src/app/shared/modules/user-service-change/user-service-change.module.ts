import { UserServiceChnageComponent } from './user-service-change.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { UserServiceChangeRoutingModule } from './user-service-change.routing.module';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { LoadingSpinnerModule } from '../loading-spinner/loading-spinner.module';
import { CapitalizeFirstPipeModule } from '../../pipes/capitalize.module';



@NgModule({
    imports: [
      MatTableModule,
      MatCheckboxModule,
      CommonModule,
      MatFormFieldModule,
      UserServiceChangeRoutingModule,
      MatInputModule,
      FormsModule,
      LoadingSpinnerModule,
      CapitalizeFirstPipeModule
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
