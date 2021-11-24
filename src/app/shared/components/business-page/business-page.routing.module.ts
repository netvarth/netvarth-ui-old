import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BusinessPageComponent } from "./business-page.component";

const routes: Routes = [
    { path: '', component: BusinessPageComponent},
    { path: 'home', loadChildren: () => import('../business-page-home/business-page-home.module').then(m => m.BusinessPageHomeModule) },
    { path: ':userEncId', component: BusinessPageComponent},
    { path: 'service/:serid', loadChildren: () => import('./service-view/service-view.module').then(m => m.ServiceViewModule) },
    { path: ':userEncId/service/:serid', loadChildren: () => import('./service-view/service-view.module').then(m => m.ServiceViewModule) }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BusinessPageRoutingModule {}