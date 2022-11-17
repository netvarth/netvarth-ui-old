import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmiCalciComponent } from './emi-calci.component';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: '', component: EmiCalciComponent }
]


@NgModule({
  declarations: [
    EmiCalciComponent
  ],
  imports: [
    CommonModule,
    [RouterModule.forChild(routes)]
  ]
})
export class EmiCalciModule { }
