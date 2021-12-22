import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { QuestionnaireLinkComponent } from './questionnaire-link.component';
const routes: Routes = [
    { path: '', component: QuestionnaireLinkComponent },
    { path: ':type', component: QuestionnaireLinkComponent }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class QuestionnaireLinkRoutingModule { }
