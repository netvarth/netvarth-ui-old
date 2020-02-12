import { Routes, RouterModule } from '@angular/router';
import { BranchUsersComponent } from './users.component';
import { NgModule } from '@angular/core';
import { BranchUserDetailComponent } from './details/user-detail.component';
import { ManageOnlineProfileComponent } from './manageOnlineProfile/manageonlineprofile.component';

const routes: Routes = [
    { path: '', component: BranchUsersComponent },
    { path: ':id', component: BranchUserDetailComponent },
    { path: ':id/bprofile', loadChildren: () => import('./bprofile/buserprofile.module').then(m => m.BuserProfileModule)},
    { path: ':id/settings', loadChildren: () => import('./manageSettings/manageSettings.module').then(m => m.ManageSettingsModule)}
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UsersRoutingModule {}
