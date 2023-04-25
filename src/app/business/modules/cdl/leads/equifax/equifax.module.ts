import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquifaxComponent } from './equifax.component';
import { RouterModule, Routes } from '@angular/router';
import { SkeletonLoadingModule } from '../../../../../shared/modules/skeleton-loading/skeleton-loading.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxPaginationModule } from 'ngx-pagination';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { PagerModule } from '../../../../../shared/modules/pager/pager.module';
import { CapitalizeFirstPipeModule } from '../../../../../shared/pipes/capitalize.module';
import { SelectSchemeModule } from '../../loans/select-scheme/select-scheme.module';

const routes: Routes = [
  { path: '', component: EquifaxComponent }
]

@NgModule({
  declarations: [
    EquifaxComponent
  ],
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
    NgxPaginationModule,
    PagerModule,
    TableModule,
    CalendarModule,
    MultiSelectModule,
    DropdownModule,
    ButtonModule,
    InputTextModule,
    [RouterModule.forChild(routes)]
  ]
})
export class EquifaxModule { }