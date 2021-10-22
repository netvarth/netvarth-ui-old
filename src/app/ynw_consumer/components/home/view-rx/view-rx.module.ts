import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { NgxQRCodeModule } from "ngx-qrcode2";
import { ShareButtonsModule } from "ngx-sharebuttons/buttons";
import { ShareIconsModule } from "ngx-sharebuttons/icons";
import { ViewRxComponent } from "./view-rx.component";

@NgModule({
    imports: [
        MatDialogModule,
        ShareButtonsModule,
        ShareIconsModule,
        NgxQRCodeModule,
        CommonModule
    ],
    declarations: [
        ViewRxComponent
    ],
    exports: [
        ViewRxComponent
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
    ]
})
export class ViewRxModule {}