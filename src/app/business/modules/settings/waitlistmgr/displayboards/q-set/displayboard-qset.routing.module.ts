import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DisplayboardQSetComponent } from './displayboard-qset.component';
import { DisplayboardQSetDetailComponent } from './detail/displayboard-qset-detail.component';

const routes: Routes = [
    { path: '', component: DisplayboardQSetComponent},
    { path: ':id', component: DisplayboardQSetDetailComponent }
    // { path: 'labels', loadChildren: '../../../business/modules/displayboardmgr/labels/displayboard-labels.module#DisplayboardLabelsModule' },
    // { path: 'list', loadChildren: '../../../business/modules/displayboardmgr/displayboard/displayboards.module#DisplayboardsModule' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DisplayboardQSetRoutingModule {}
