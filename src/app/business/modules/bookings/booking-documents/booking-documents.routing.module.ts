import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BookingDocumentsComponent } from './booking-documents.component';

const routes: Routes = [
    { path: '', component: BookingDocumentsComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class BookingDocumentsRoutingModule { }
