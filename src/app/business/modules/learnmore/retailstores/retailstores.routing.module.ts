import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { RetailStoresComponent } from "./retailstores.component";

const routes: Routes = [
    { path: ':parent', component: RetailStoresComponent },
    { path: '/help', component: RetailStoresComponent }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RetailStoresRoutingModule {

}