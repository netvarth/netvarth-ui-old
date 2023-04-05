import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailsCollectComponent } from './details-collect.component';
import { RouterModule, Routes } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';

const routes: Routes = [
  { path: '', component: DetailsCollectComponent }
]

@NgModule({
  declarations: [
    DetailsCollectComponent
  ],
  imports: [
    CommonModule,
    MatExpansionModule,
    [RouterModule.forChild(routes)]
  ]
})
export class DetailsCollectModule { }
