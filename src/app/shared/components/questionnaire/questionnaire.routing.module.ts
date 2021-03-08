import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { QuestionnaireComponent } from './questionnaire.component';
const routes: Routes = [
    { path: '', component: QuestionnaireComponent }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class QuestionnaireRoutingModule { }
