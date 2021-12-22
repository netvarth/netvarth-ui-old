import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { JcCouponNoteComponent } from "./jc-coupon-note.component";

@NgModule({
    imports:[
        CommonModule,
        MatDialogModule
    ],
    exports: [JcCouponNoteComponent],
    declarations: [JcCouponNoteComponent]
})
export class JcCouponNoteModule {}