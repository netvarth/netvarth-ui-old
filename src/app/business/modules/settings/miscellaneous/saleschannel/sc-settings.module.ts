import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SalesChannelModule } from "../../../../../shared/modules/saleschannel/saleschannel.module";
import { SaleschannelSettingsComponent } from "./sc-settings.component";

@NgModule({
    imports: [
        SalesChannelModule,
        CommonModule
    ],
    exports: [
        SaleschannelSettingsComponent
    ],
    declarations: [
        SaleschannelSettingsComponent
    ]
})
export class SCSettingsModule {}