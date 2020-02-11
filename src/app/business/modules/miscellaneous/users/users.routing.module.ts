import { Routes, RouterModule } from '@angular/router';
import { BranchUsersComponent } from './users.component';
import { NgModule } from '@angular/core';
import { BranchUserDetailComponent } from './details/user-detail.component';
import { ManageOnlineProfileComponent } from './manageOnlineProfile/manageonlineprofile.component';

const routes: Routes = [
    { path: '', component: BranchUsersComponent },
    { path: ':id', component: BranchUserDetailComponent },
    { path: ':id/bprofile', loadChildren: () => import('./bprofile/bprofile.module').then(m => m.BProfileModule)},
    { path: ':id/settings', loadChildren: () => import('./manageSettings/manageSettings.module').then(m => m.ManageSettingsModule)},
    //{ path: 'manageonlineprofile', component: ManageOnlineProfileComponent}
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UsersRoutingModule {}
