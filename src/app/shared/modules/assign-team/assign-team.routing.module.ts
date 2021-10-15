import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssignTeam } from './assign-team.component';
const routes: Routes = [
    { path: '', component: AssignTeam },
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AssignTeamRoutingModule  { }