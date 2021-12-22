import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatTooltipModule } from "@angular/material/tooltip";
import { JoyrideModule } from "ngx-joyride";
import { ProviderStartTourModule } from "../../modules/provider-start-tour/provider-start-tour.module";
import { BusinessHeaderComponent } from "./header.component";
import { HelpPopUpModule } from "./help-pop-up/help-pop-up.module";

@NgModule({
    declarations: [BusinessHeaderComponent],
    exports: [BusinessHeaderComponent],
    imports: [
        CommonModule,
        HelpPopUpModule,
        MatTooltipModule,
        ProviderStartTourModule,
        JoyrideModule
    ]
})
export class BusinessHeaderModule{}