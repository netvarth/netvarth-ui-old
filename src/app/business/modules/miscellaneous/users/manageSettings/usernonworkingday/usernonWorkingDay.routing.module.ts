import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { usernonWorkingDaylistcomponent } from './usernonWorkingDaylist/usernonWorkingDaylist.component';
import { usernonWorkingDaydetailscomponent } from './usernonWorkingDaydetails/usernonWorkingDaydetails.component';

const routes: Routes = [
    { path: '', component:usernonWorkingDaylistcomponent },
    { path: ':sid', component:usernonWorkingDaydetailscomponent },
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class usernonWorkingDayroutingmodule {}
