import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NonWorkingDaylistcomponent } from './NonWorkingDaylist/NonWorkingDay-list.component';
import {NonWorkingDaydetailscomponent} from './NonWorkingDaydetails/NonWorkingDay-details.component'

const routes: Routes = [
    { path: '', component:NonWorkingDaylistcomponent },
    { path: ':id', component: NonWorkingDaydetailscomponent },
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class NonWorkingDayroutingmodule {}
