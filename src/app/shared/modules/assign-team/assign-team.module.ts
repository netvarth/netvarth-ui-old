import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadingSpinnerModule } from '../loading-spinner/loading-spinner.module';
import { AssignTeam } from './assign-team.component';
import { ConfirmBoxModule } from '../../../business/shared/confirm-box/confirm-box.module';
import { TeamMembersModule } from './team-members/team-members.module';
import { RouterModule, Routes } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
const routes: Routes = [
  { path: '', component: AssignTeam },
];
@NgModule({
  imports: [
    MatTableModule,
    MatCheckboxModule,
    MatTooltipModule,
    CommonModule,
    FormsModule,
    LoadingSpinnerModule,
    ConfirmBoxModule,
    TeamMembersModule,
    [RouterModule.forChild(routes)]
  ],
  declarations: [
    AssignTeam
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
})
export class AssignTeamModule { }
