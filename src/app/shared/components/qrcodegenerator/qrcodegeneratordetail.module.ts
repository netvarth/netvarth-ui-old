import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { NgxQRCodeModule } from "ngx-qrcode2";
import { ShareButtonsModule } from "ngx-sharebuttons/buttons";
import { QRCodeGeneratordetailComponent } from "./qrcodegeneratordetail.component";

@NgModule({
    declarations: [QRCodeGeneratordetailComponent],
    exports: [QRCodeGeneratordetailComponent],
    imports: [
        CommonModule,
        MatDialogModule,
        ShareButtonsModule,
        NgxQRCodeModule
    ]
})
export class QRCodeGeneratordetailModule{}