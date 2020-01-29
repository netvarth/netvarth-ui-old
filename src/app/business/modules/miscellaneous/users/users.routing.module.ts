import { Routes, RouterModule } from '@angular/router';
import { BranchUsersComponent } from './users.component';
import { NgModule } from '@angular/core';
import { BranchUserDetailComponent } from './details/user-detail.component';
import { AdditionalInfoComponent } from './additionalinfo/additionalinfo.component';

const routes: Routes = [
    { path: '', component: BranchUsersComponent },
    { path: 'add', component: BranchUserDetailComponent },
    { path: 'additionalinfo', component: AdditionalInfoComponent}
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UsersRoutingModule {}
