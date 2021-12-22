import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { NgxQRCodeModule } from "ngx-qrcode2";
import { ShareButtonsModule } from "ngx-sharebuttons/buttons";
import { ShareIconsModule } from "ngx-sharebuttons/icons";
import { ServiceQRCodeGeneratordetailComponent } from "./serviceqrcodegeneratordetail.component";

@NgModule({
    imports: [
        CommonModule,
        MatDialogModule,
        NgxQRCodeModule,
        ShareButtonsModule,
        ShareIconsModule
    ],
    exports: [ServiceQRCodeGeneratordetailComponent],
    declarations: [ServiceQRCodeGeneratordetailComponent]
})
export class ServiceqrcodegeneratorModule {}