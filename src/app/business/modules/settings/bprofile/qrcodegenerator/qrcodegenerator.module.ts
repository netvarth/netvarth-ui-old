import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { NgxQRCodeModule } from "ngx-qrcode2";
import { ShareButtonsModule } from "ngx-sharebuttons/buttons";
import { QRCodeGeneratorComponent } from "./qrcodegenerator.component";

@NgModule({
    declarations: [QRCodeGeneratorComponent],
    exports: [QRCodeGeneratorComponent],
    imports: [
        CommonModule,
        MatDialogModule,
        NgxQRCodeModule,
        ShareButtonsModule
    ]
})
export class QRCodeGeneratorModule {}