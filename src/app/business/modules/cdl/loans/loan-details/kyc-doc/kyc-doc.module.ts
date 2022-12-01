import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KycDocComponent } from './kyc-doc.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: KycDocComponent }
]


@NgModule({
  declarations: [
    KycDocComponent
  ],
  imports: [
    CommonModule,
    [RouterModule.forChild(routes)]
  ],
  exports: [
    KycDocComponent
  ]
})
export class KycDocModule { }
