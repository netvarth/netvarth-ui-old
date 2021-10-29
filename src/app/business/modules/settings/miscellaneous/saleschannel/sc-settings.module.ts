import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SalesChannelModule } from "../../../../../shared/modules/saleschannel/saleschannel.module";
import { SaleschannelSettingsComponent } from "./sc-settings.component";
const routes: Routes = [
    {path: '', component: SaleschannelSettingsComponent}
]
@NgModule({
    imports: [
        SalesChannelModule,
        CommonModule,
        [RouterModule.forChild(routes)]
    ],
    exports: [
        SaleschannelSettingsComponent
    ],
    declarations: [
        SaleschannelSettingsComponent
    ]
})
export class SCSettingsModule {}