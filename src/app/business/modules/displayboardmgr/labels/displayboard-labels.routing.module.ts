import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DisplayboardLabelComponent } from './detail/displayboard-label';
import { DisplayboardLabelsComponent } from './displayboard-labels';

const routes: Routes = [
    { path: '', component: DisplayboardLabelsComponent},
    { path: ':id', component: DisplayboardLabelComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DisplayboardLabelsRoutingModule {}
