import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuestionnaireListPopupComponent } from './questionnaire-list-popup.component';

const routes: Routes = [
    { path: '', component: QuestionnaireListPopupComponent }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class QuestionnaireListPopupRoutingModule { }
