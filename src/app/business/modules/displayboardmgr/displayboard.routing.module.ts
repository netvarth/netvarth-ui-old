import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DisplayboardMgrComponent } from './displayboardmgr.component';

const routes: Routes = [
    { path: '', component: DisplayboardMgrComponent},
    { path: 'labels', loadChildren: '../../../business/modules/displayboardmgr/labels/displayboard-labels.module#DisplayboardLabelsModule' },
    { path: 'list', loadChildren: '../../../business/modules/displayboardmgr/displayboard/displayboards.module#DisplayboardsModule' },
    { path: 'layout', loadChildren: '../../../business/modules/displayboardmgr/layout/displayboard-layout.module#DisplayboardLayoutModule'}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DisplayboardRoutingModule {}
