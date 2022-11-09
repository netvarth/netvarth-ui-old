import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BranchesComponent } from './branches.component';
import { RouterModule, Routes } from '@angular/router';
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
import { PagerModule } from '../../../shared/modules/pager/pager.module';
import { SkeletonLoadingModule } from '../../../shared/modules/skeleton-loading/skeleton-loading.module';
import { CapitalizeFirstPipeModule } from '../../../shared/pipes/capitalize.module';
import { SelectSchemeModule } from '../cdl/loans/select-scheme/select-scheme.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

const routes: Routes = [
  { path: '', component: BranchesComponent },
  { path: 'create', loadChildren: () => import('./create-branch/create-branch.module').then(m => m.CreateBranchModule) },
  { path: 'update', loadChildren: () => import('./create-branch/create-branch.module').then(m => m.CreateBranchModule) },
];


@NgModule({
  declarations: [
    BranchesComponent
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
    MatSlideToggleModule,
    [RouterModule.forChild(routes)]
  ]
})
export class BranchesModule { }
