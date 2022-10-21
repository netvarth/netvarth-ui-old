import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchemesComponent } from './schemes.component';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule, Routes } from '@angular/router';
import { SkeletonLoadingModule } from '../../shared/modules/skeleton-loading/skeleton-loading.module';
import { CapitalizeFirstPipeModule } from '../../shared/pipes/capitalize.module';

const routes: Routes = [
  { path: '', component: SchemesComponent },
]

@NgModule({
  declarations: [
    SchemesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatTooltipModule,
    MatDatepickerModule,
    CapitalizeFirstPipeModule,
    SkeletonLoadingModule,
    [RouterModule.forChild(routes)]
  ]
})
export class SchemesModule { }
