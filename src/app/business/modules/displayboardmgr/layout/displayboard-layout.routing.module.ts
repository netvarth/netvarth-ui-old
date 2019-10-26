import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DisplayboardLayoutsComponent } from './displayboard-layouts';
import { DisplayboardLayoutComponent } from './detail/displayboard-layout';

const routes: Routes = [
    { path: '', component: DisplayboardLayoutsComponent},
    { path: ':id', component: DisplayboardLayoutComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DisplayboardLayoutsRoutingModule {}
