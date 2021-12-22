import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatTooltipModule } from "@angular/material/tooltip";
import { RouterModule } from "@angular/router";
import { CapitalizeFirstPipeModule } from "../../../shared/pipes/capitalize.module";
import { MenuComponent } from "./menu.component";

@NgModule({
    declarations: [MenuComponent],
    exports: [MenuComponent],
    imports: [
        CommonModule,
        MatTooltipModule,
        RouterModule,
        CapitalizeFirstPipeModule
    ]
})
export class MenuModule{}