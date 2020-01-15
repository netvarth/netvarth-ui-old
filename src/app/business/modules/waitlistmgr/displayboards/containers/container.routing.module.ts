import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContainersComponent } from './containers.component';
import { ContainerDetailComponent } from './detail/container-detail.component';

const routes: Routes = [
    { path: '', component: ContainersComponent},
    { path: ':id', component: ContainerDetailComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ContainerRoutingModule {}
