import { Routes, RouterModule } from '@angular/router';
import { BranchUsersComponent } from './users.component';
import { NgModule } from '@angular/core';
import { BranchUserDetailComponent } from './details/user-detail.component';

const routes: Routes = [
    { path: '', component: BranchUsersComponent },
    { path: ':id', component: BranchUserDetailComponent }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UsersRoutingModule {}
