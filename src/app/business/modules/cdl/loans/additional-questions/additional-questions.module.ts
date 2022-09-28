import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdditionalQuestionsComponent } from './additional-questions.component';
import { Routes, RouterModule } from '@angular/router';
import { ConfirmBoxModule } from '../confirm-box/confirm-box.module';

const routes: Routes = [
  { path: '', component: AdditionalQuestionsComponent }
]

@NgModule({
  declarations: [
    AdditionalQuestionsComponent
  ],
  imports: [
    CommonModule,
    ConfirmBoxModule,
    [RouterModule.forChild(routes)]
  ]
})
export class AdditionalQuestionsModule { }
