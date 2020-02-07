import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DisplayboardsComponent } from './displayboards.component';
import { DisplayboardDetailComponent } from './detail/displayboard-details.component';
import { GlobalSettingsComponent } from './global-settings/global-settings.component';

const routes: Routes = [
    { path: '', component: DisplayboardsComponent},
    { path: 'q-set', loadChildren: './q-set/displayboard-qset.module#DisplayboardQSetModule' },
    { path: 'containers', loadChildren: './containers/container.module#ContainerModule' },
    { path: ':id', component: DisplayboardDetailComponent },
  //  { path: 'global', component: GlobalSettingsComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DisplayboardsRoutingModule {}
