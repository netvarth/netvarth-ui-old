import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { Nl2BrPipeModule } from "nl2br-pipe";
import { CouponsComponent } from "./coupons.component";

@NgModule({
    imports: [
        MatDialogModule,
        CommonModule,
        Nl2BrPipeModule
    ],
    exports: [CouponsComponent],
    declarations: [CouponsComponent]
})
export class CouponsModule {}