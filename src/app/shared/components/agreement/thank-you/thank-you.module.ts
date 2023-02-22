import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThankYouComponent } from './thank-you.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: ThankYouComponent }
]


@NgModule({
  declarations: [
    ThankYouComponent
  ],
  imports: [
    CommonModule,
    [RouterModule.forChild(routes)]
  ]
})
export class ThankYouModule { }
