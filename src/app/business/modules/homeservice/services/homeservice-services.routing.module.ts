import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeserviceServiceDetailComponent } from './details/homeservice-servicedetail.component';
import { HomeserviceServicesComponent } from './list/homeservice-services.component';

const routes: Routes = [
    { path: '', component: HomeserviceServicesComponent },
    { path: ':id', component: HomeserviceServiceDetailComponent }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HomeserviceServicesRoutingModule {}
