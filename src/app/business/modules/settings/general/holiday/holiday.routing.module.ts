import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HolidayDetailsComponent } from './holiday-details/holiday-details.component';
import { HolidayListComponent } from './holiday-list/holiday-list.component';

const routes: Routes = [
    { path: '', component: HolidayListComponent },
    { path: ':id', component: HolidayDetailsComponent },
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class HolidayRoutingmModule { }
