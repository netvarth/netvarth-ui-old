import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BusinessprovideruserPageComponent } from "./business-provideruser-page.component";

const routes: Routes = [
    { path: '', component: BusinessprovideruserPageComponent},
    { path: 'home', loadChildren: () => import('../business-page-home/business-page-home.module').then(m => m.BusinessPageHomeModule) },
    { path: ':userEncId', component: BusinessprovideruserPageComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BusinessprovideruserPageRoutingModule {}