import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsumerAgreementComponent } from './consumer-agreement.component';
import { RouterModule, Routes } from '@angular/router';



const routes: Routes = [
  { path: '', component: ConsumerAgreementComponent }
]


@NgModule({
  declarations: [
    ConsumerAgreementComponent
  ],
  imports: [
    CommonModule,
    [RouterModule.forChild(routes)]
  ]
})
export class ConsumerAgreementModule { }
