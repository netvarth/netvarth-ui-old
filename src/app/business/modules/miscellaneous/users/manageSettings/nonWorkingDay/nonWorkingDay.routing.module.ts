import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { nonWorkingDaylistcomponent } from './nonWorkingDaylist/nonWorkingDaylist.component';
import {nonWorkingDaydetailscomponent} from './nonWorkingDaydetails/nonWorkingDaydetails.component'

const routes: Routes = [
    { path: '', component:nonWorkingDaylistcomponent },
    { path: ':id', component:nonWorkingDaydetailscomponent },
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class nonWorkingDayroutingmodule {}
