import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoansComponent } from './loans.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { CapitalizeFirstPipeModule } from "../../../../shared/pipes/capitalize.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { SkeletonLoadingModule } from '../../../../shared/modules/skeleton-loading/skeleton-loading.module';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SelectSchemeModule } from './select-scheme/select-scheme.module';


const routes: Routes = [
  { path: '', component: LoansComponent },
  { path: 'create', loadChildren: () => import('./create/create.module').then(m => m.CreateModule) },
  { path: 'update', loadChildren: () => import('./create/create.module').then(m => m.CreateModule) },
  { path: 'approved', loadChildren: () => import('./approved/approved.module').then(m => m.ApprovedModule) },
  { path: 'additionalqa', loadChildren: () => import('./additional-questions/additional-questions.module').then(m => m.AdditionalQuestionsModule) },

]

@NgModule({
  exports: [LoansComponent],
  declarations: [LoansComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatTooltipModule,
    MatDatepickerModule,
    CapitalizeFirstPipeModule,
    SkeletonLoadingModule,
    MatSelectModule,
    MatOptionModule,
    CommonModule,
    MatDialogModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    FormsModule,
    MatExpansionModule,
    SelectSchemeModule,
    [RouterModule.forChild(routes)]
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class LoansModule { }
