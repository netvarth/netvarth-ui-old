import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdditionalQuestionsComponent } from './additional-questions.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', component: AdditionalQuestionsComponent }
]

@NgModule({
  declarations: [
    AdditionalQuestionsComponent
  ],
  imports: [
    CommonModule,
    [RouterModule.forChild(routes)]
  ]
})
export class AdditionalQuestionsModule { }
