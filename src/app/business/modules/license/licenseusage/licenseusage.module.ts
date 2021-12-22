import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { licenseusageComponent } from "./licenseusage.component";
const routes: Routes = [
    {path:'',component: licenseusageComponent}
]
@NgModule({
    declarations: [licenseusageComponent],
    exports: [licenseusageComponent],
    imports: [
        CommonModule,
        [RouterModule.forChild(routes)]
    ]
})
export class LicenseusageModule{}