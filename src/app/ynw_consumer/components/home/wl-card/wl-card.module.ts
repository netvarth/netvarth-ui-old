import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatTooltipModule } from "@angular/material/tooltip";
import { CapitalizeFirstPipeModule } from "../../../../shared/pipes/capitalize.module";
import { WlCardComponent } from "./wl-card.component";

@NgModule({
    imports:[
        MatTooltipModule,
        MatIconModule,
        MatMenuModule,
        MatButtonModule,
        MatGridListModule,
        CommonModule,
        CapitalizeFirstPipeModule
    ],
    exports:[
        WlCardComponent
    ],
    declarations: [
        WlCardComponent
    ]
})
export class WLCardModule {}