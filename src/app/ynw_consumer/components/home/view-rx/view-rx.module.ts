import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { NgxQRCodeModule } from "ngx-qrcode2";
import { ShareButtonModule } from "ngx-sharebuttons/button";
import { ViewRxComponent } from "./view-rx.component";

@NgModule({
    imports: [
        MatDialogModule,
        ShareButtonModule,
        NgxQRCodeModule
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