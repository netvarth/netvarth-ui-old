import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DisplayboardsComponent } from './displayboards.component';
import { DisplayboardDetailComponent } from './detail/displayboard-details.component';
import { GlobalSettingsComponent } from './global-settings/global-settings.component';

const routes: Routes = [
    { path: '', component: DisplayboardsComponent},
    { path: 'q-set', loadChildren: () => import('./q-set/displayboard-qset.module').then(m => m.DisplayboardQSetModule) },
    { path: 'containers', loadChildren: () => import('./containers/container.module').then(m => m.ContainerModule) },
    { path: ':id', component: DisplayboardDetailComponent },
   // { path: 'global', component: GlobalSettingsComponent },
    { path: 'global', loadChildren: () => import('./global-settings/global-settings.module').then(m => m.GlobalSettingsModule) },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DisplayboardsRoutingModule {}
