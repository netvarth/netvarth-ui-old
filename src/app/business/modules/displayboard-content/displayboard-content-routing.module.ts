import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DisplayboardLayoutContentComponent } from './displayboard-content.component';

const routes: Routes = [
    { path: '', component: DisplayboardLayoutContentComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DisplayboardContentRoutingModule {}
