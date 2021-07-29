import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BusinessPageHomeComponent } from "./business-page-home.component";

const routes: Routes = [
    { path: '', component: BusinessPageHomeComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BusinessPageHomeRoutingModule {}