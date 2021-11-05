import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CustomAppComponent } from "./custom-app.component";
const routes: Routes = [
    { path: '', component: CustomAppComponent}
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CustomAppRoutingModule{}