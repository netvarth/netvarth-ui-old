import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserServiceChnageComponent } from './user-service-change.component';
const routes: Routes = [
    { path: '', component: UserServiceChnageComponent },
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class  UserServiceChangeRoutingModule  { }