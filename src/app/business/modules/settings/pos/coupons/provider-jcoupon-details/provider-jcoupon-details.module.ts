import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { RouterModule, Routes } from "@angular/router";
import { CapitalizeFirstPipeModule } from "../../../../../../shared/pipes/capitalize.module";
import { ProviderJcouponDetailsComponent } from "./provider-jcoupon-details.component";
const routes: Routes = [
    {path: '', component: ProviderJcouponDetailsComponent}
]
@NgModule({
    declarations: [ProviderJcouponDetailsComponent],
    exports: [ProviderJcouponDetailsComponent],
    imports: [
        CommonModule,
        MatCheckboxModule,
        MatSlideToggleModule,
        CapitalizeFirstPipeModule,
        [RouterModule.forChild(routes)]
    ]
})
export class ProviderJcouponDetailsModule{}