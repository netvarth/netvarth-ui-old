import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailsCollectComponent } from './details-collect.component';
import { RouterModule, Routes } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { QuestionnaireModule } from '../../../../shared/components/questionnaire/questionnaire.module';
import { MatButtonModule } from '@angular/material/button';
import { QuestionaireViewModule } from '../../../../shared/components/questionaire-view/questionaire-view.module';
import { MatMenuModule } from '@angular/material/menu';
import { RemarksModule } from '../remarks/remarks.module';

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
    MatButtonModule,
    QuestionnaireModule,
    QuestionaireViewModule,
    MatMenuModule,
    RemarksModule,
    [RouterModule.forChild(routes)]
  ]
})
export class DetailsCollectModule { }
