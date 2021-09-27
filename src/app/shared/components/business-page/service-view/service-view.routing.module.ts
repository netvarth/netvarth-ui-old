import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ServiceViewComponent } from './service-view.component';
const routes: Routes = [
    { path: '', component: ServiceViewComponent }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ServiceViewRoutingModule { }
