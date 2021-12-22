import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { TermsConditionComponent } from "./terms-condition.component";

@NgModule({
    declarations: [TermsConditionComponent],
    exports: [TermsConditionComponent],
    imports: [
        CommonModule,
        MatDialogModule
    ]
})
export class TermsConditionModule{}