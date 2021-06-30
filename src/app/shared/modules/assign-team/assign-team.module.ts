import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { LoadingSpinnerModule } from '../loading-spinner/loading-spinner.module';
import { AssignTeam } from './assign-team.component';
import { AssignTeamRoutingModule } from './assign-team.routing.module';



@NgModule({
    imports: [
      MatTableModule,
      MatCheckboxModule,
      CommonModule,
      MatFormFieldModule,
      AssignTeamRoutingModule,
      MatInputModule,
      FormsModule,
      LoadingSpinnerModule
      
    ],
    declarations: [
    //    UserServiceChnageComponent 
       AssignTeam
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
      ],
})
export class AssignTeamModule { }
