import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatTooltipModule } from "@angular/material/tooltip";
import { CapitalizeFirstPipeModule } from "../../shared/pipes/capitalize.module";
import { BasicProfileComponent } from "./basic-profile.component";

@NgModule({
    declarations: [
        BasicProfileComponent
    ],
    imports: [
        CommonModule,
        CapitalizeFirstPipeModule,
        MatTooltipModule
    ],
    exports: [
        BasicProfileComponent
    ]
})

export class BasicProfileModule {}
