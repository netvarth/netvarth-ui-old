import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NonWorkingDayDetailsComponent } from './holiday-details/holiday-details.component';
import { NonWorkingDaylistComponent } from './holiday-list/holiday-list.component';

const routes: Routes = [
    { path: '', component: NonWorkingDaylistComponent },
    { path: ':id', component: NonWorkingDayDetailsComponent },
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class NonWorkingDayRoutingmModule { }
