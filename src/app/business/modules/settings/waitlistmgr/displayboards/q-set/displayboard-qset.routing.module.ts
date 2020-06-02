import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DisplayboardQSetComponent } from './displayboard-qset.component';
import { DisplayboardQSetDetailComponent } from './detail/displayboard-qset-detail.component';

const routes: Routes = [
    { path: '', component: DisplayboardQSetComponent},
    { path: ':id', component: DisplayboardQSetDetailComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DisplayboardQSetRoutingModule {}
