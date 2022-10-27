import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CapitalizeFirstPipeModule } from "../../../../shared/pipes/capitalize.module";
import { DealerComponent } from './dealer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SkeletonLoadingModule } from '../../../../shared/modules/skeleton-loading/skeleton-loading.module';
import { SelectSchemeModule } from '../loans/select-scheme/select-scheme.module';


const routes: Routes = [
  { path: '', component: DealerComponent },
  { path: 'create', loadChildren: () => import('./create-dealer/create-dealer.module').then(m => m.CreateDealerModule) },
  { path: 'update', loadChildren: () => import('./create-dealer/create-dealer.module').then(m => m.CreateDealerModule) },
  { path: 'approved', loadChildren: () => import('./dealer-approved/dealer-approved.module').then(m => m.DealerApprovedModule) },
  { path: 'view/:id', loadChildren: () => import('./view-dealer/view-dealer.module').then(m => m.ViewDealerModule) },
  { path: 'approve', loadChildren: () => import('./dealer-approve/dealer-approve.module').then(m => m.DealerApproveModule) },
]


@NgModule({
  declarations: [
    DealerComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatDatepickerModule,
    MatTooltipModule,
    CapitalizeFirstPipeModule,
    SkeletonLoadingModule,
    MatDialogModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatExpansionModule,
    SelectSchemeModule,
    [RouterModule.forChild(routes)]
  ],
  exports: [
    DealerComponent
  ]
})
export class DealerModule { }
