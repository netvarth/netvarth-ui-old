import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubmitPaperComponent } from './submit-paper.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuestionnaireModule } from '../../../../../../src/app/shared/components/questionnaire/questionnaire.module';

const routes: Routes = [
    { path: '', component: SubmitPaperComponent },
];

@NgModule({
  declarations: [
    SubmitPaperComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    QuestionnaireModule,
    [RouterModule.forChild(routes)]
  ]
})
export class SubmitPaperModule { }
