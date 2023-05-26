import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonLoadingComponent } from './skeleton-loading.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    SkeletonLoadingComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    SkeletonLoadingComponent
  ]
})
export class SkeletonLoadingModule { }
