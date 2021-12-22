import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { ProviderStartTourComponent } from "./provider-start-tour.component";

@NgModule({
    declarations: [ProviderStartTourComponent],
    exports: [ProviderStartTourComponent],
    imports: [
        CommonModule,
        MatDialogModule
    ]
})
export class ProviderStartTourModule{}