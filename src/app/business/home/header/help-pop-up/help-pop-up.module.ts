import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { MatGridListModule } from "@angular/material/grid-list";
import { JoyrideModule } from "ngx-joyride";
import { HelpPopUpComponent } from "./help-pop-up.component";

@NgModule({
    declarations: [HelpPopUpComponent],
    exports: [HelpPopUpComponent],
    imports: [
        CommonModule,
        MatDialogModule,
        JoyrideModule,
        MatGridListModule
    ]
})
export class HelpPopUpModule{}