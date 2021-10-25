import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { PricingContentDialog } from "./pricing-content-dialog.component";

@NgModule({
    declarations: [PricingContentDialog],
    exports: [PricingContentDialog],
    imports: [
        CommonModule,
        MatDialogModule
    ]
})
export class PricingContentDialogModule{}