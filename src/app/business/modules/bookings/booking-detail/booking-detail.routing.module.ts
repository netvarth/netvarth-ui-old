import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BookingDetailComponent } from './booking-detail.component';
import { BookingPrivateNotesComponent } from './booking-private-notes/booking-private-notes.component';

const routes: Routes = [
    { path: '', component: BookingDetailComponent },
    { path: 'notes', component: BookingPrivateNotesComponent },
    { path: 'questionnaires', loadChildren: () => import('../../questionnaire-list-popup/questionnaire-list-popup.module').then(m => m.QuestionnaireListPopupModule) }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class BookingDetailRoutingModule { }
