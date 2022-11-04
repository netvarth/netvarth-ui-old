import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomersComponent } from './customers.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { SkeletonLoadingModule } from '../../shared/modules/skeleton-loading/skeleton-loading.module';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: CustomersComponent },
]

@NgModule({
  declarations: [
    CustomersComponent
  ],
  imports: [
    CommonModule,
    NgxPaginationModule,
    SkeletonLoadingModule,
    [RouterModule.forChild(routes)]
  ], exports: [
    CustomersComponent
  ]
})
export class CustomersModule { }
