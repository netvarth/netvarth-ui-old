import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NonWorkingDaylistComponent } from './nonWorkingDaylist/nonWorkingDaylist.component';
import { NonWorkingDaydetailsComponent } from './nonWorkingDaydetails/nonWorkingDaydetails.component';

const routes: Routes = [
    { path: '', component: NonWorkingDaylistComponent },
    { path: ':id', component: NonWorkingDaydetailsComponent },
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class NonWorkingDayRoutingModule { }
