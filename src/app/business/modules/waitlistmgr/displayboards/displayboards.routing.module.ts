import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DisplayboardsComponent } from './displayboards.component';
import { DisplayboardDetailComponent } from './detail/displayboard-details.component';

const routes: Routes = [
    { path: '', component: DisplayboardsComponent},
    { path: 'q-set', loadChildren: './q-set/displayboard-qset.module#DisplayboardQSetModule' },
    { path: ':id', component: DisplayboardDetailComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DisplayboardsRoutingModule {}
