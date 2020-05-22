import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsernonWorkingDaylistComponent } from './usernonWorkingDaylist/usernonWorkingDaylist.component';
import { UsernonWorkingDaydetailsComponent } from './usernonWorkingDaydetails/usernonWorkingDaydetails.component';

const routes: Routes = [
    { path: '', component: UsernonWorkingDaylistComponent },
    { path: ':sid', component: UsernonWorkingDaydetailsComponent },
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class UsernonWorkingDayroutingModule { }
