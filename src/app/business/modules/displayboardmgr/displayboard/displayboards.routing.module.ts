import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DisplayboardListComponent } from './displayboard-list';
import { DisplayboardDetailComponent } from './detail/displayboard-detail';

const routes: Routes = [
    { path: '', component: DisplayboardListComponent},
    { path: ':action', component: DisplayboardDetailComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DisplayboardsRoutingModule {}
