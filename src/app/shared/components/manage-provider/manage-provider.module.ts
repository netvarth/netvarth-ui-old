import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ManageProviderComponent } from "./manage-provider.component";
const routes: Routes = [
    { path: '', component: ManageProviderComponent}
]
@NgModule({
    imports:[
        [RouterModule.forChild(routes)]
    ],
    exports: [
        ManageProviderComponent
    ],
    declarations: [
        ManageProviderComponent
    ]
})
export class ManageProviderModule {}