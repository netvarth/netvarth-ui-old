import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuestionnaireComponent } from './questionnaire.component';
import { QuestionnaireDetailsComponent } from './questionnaire-details/questionnaire-details.component';

const routes: Routes = [
    { path: '', component: QuestionnaireComponent },
    { path: ':id', component: QuestionnaireDetailsComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class QuestionnaireRoutingModule { }
