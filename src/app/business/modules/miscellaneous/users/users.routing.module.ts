import { Routes, RouterModule } from '@angular/router';
import { BranchUsersComponent } from './users.component';
import { NgModule } from '@angular/core';
import { BranchUserDetailComponent } from './details/user-detail.component';
import { ManageOnlineProfileComponent } from './manageOnlineProfile/manageonlineprofile.component';
import { ManageSettingsComponent } from './manageSettings/manageSettings.component';

const routes: Routes = [
    { path: '', component: BranchUsersComponent },
    { path: 'add', component: BranchUserDetailComponent },
    { path: 'managesettings', component: ManageSettingsComponent},
    { path: 'manageonlineprofile', component: ManageOnlineProfileComponent},
 { path: 'manageonlineprofile',
    children: [
      { path: 'bprofile', loadChildren: './bprofile/bprofile.module#BProfileModule'}]}
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UsersRoutingModule {}
