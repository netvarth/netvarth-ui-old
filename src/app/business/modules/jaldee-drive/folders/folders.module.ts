import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { FoldersComponent } from './folders.component';
import { CapitalizeFirstPipeModule } from "../../../../shared/pipes/capitalize.module";
import {NgxPaginationModule} from 'ngx-pagination';
import { LoadingSpinnerModule } from "../../../../shared/modules/loading-spinner/loading-spinner.module";


const routes: Routes = [
  { path: '', component: FoldersComponent }
]

@NgModule({
declarations: [
    FoldersComponent
],
  imports: [
    CommonModule,
    CapitalizeFirstPipeModule,
    NgxPaginationModule,
    LoadingSpinnerModule,
    [RouterModule.forChild(routes)]

  ],
  exports: [
    FoldersComponent
]
})
export class FoldersModule { }
