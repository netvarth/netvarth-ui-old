import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AgreementComponent } from './agreement.component';



const routes: Routes = [
  { path: '', component: AgreementComponent }
]


@NgModule({
  declarations: [AgreementComponent],
  imports: [
    CommonModule,
    [RouterModule.forChild(routes)]
  ]
})
export class AgreementModule { }
