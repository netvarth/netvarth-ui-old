import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AdvancedProfileComponent } from "./advanced-profile.component";
import { MatTooltipModule } from "@angular/material/tooltip";
import { CapitalizeFirstPipeModule } from "../../shared/pipes/capitalize.module";

@NgModule({
    declarations: [
        AdvancedProfileComponent
    ],
    imports: [
        CommonModule,
        CapitalizeFirstPipeModule,
        MatTooltipModule
    ],
    exports: [
        AdvancedProfileComponent
    ]
})

export class AdvancedProfileModule {}