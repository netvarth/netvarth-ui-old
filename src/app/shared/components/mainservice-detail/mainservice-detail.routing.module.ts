import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { MainserviceDetailComponent } from './mainservice-detail.component';
const routes: Routes = [
    { path: '', component: MainserviceDetailComponent }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MainserviceDetailRoutingModule { }
