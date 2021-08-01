import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BookingDetailComponent } from './booking-detail.component';

const routes: Routes = [
    { path: '', component: BookingDetailComponent },
    { path: 'questionnaires', loadChildren: () => import('../../questionnaire-list-popup/questionnaire-list-popup.module').then(m => m.QuestionnaireListPopupModule) }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class BookingDetailRoutingModule { }
