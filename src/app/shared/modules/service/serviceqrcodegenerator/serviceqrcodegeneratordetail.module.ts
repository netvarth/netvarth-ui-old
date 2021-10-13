import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { NgxQRCodeModule } from "ngx-qrcode2";
import { ShareButtonsModule } from "ngx-sharebuttons/buttons";
import { ServiceQRCodeGeneratordetailComponent } from "./serviceqrcodegeneratordetail.component";

@NgModule({
    imports: [
        MatDialogModule,
        NgxQRCodeModule,
        ShareButtonsModule
    ],
    exports: [ServiceQRCodeGeneratordetailComponent],
    declarations: [ServiceQRCodeGeneratordetailComponent]
})
export class ServiceqrcodegeneratorModule {}