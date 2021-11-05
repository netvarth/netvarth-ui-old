import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatTooltipModule } from "@angular/material/tooltip";
import { GalleryModule } from "@ks89/angular-modal-gallery";
import { TranslateModule } from "@ngx-translate/core";
import { OwlModule } from "ngx-owl-carousel";
import { Nl2BrPipeModule } from "nl2br-pipe";
import { CardModule } from "../shared/components/card/card.module";
import { HeaderModule } from "../shared/modules/header/header.module";
import { LoadingSpinnerModule } from "../shared/modules/loading-spinner/loading-spinner.module";
import { CapitalizeFirstPipeModule } from "../shared/pipes/capitalize.module";
import { SafeHtmlModule } from "../shared/pipes/safe-html/safehtml.module";
import { CustTemplate1Component } from "./cust-template1/cust-template1.component";
import { CustTemplate2Component } from "./cust-template2/cust-template2.component";
import {TableModule} from 'primeng/table';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatOptionModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { FormsModule } from "@angular/forms";
@NgModule({
    declarations: [
        CustTemplate1Component,
        CustTemplate2Component
    ],
    exports: [
        CustTemplate1Component,
        CustTemplate2Component
    ],
    imports: [
        TranslateModule,
        Nl2BrPipeModule,
        CapitalizeFirstPipeModule,
        CommonModule,
        GalleryModule,
        FormsModule,
        LoadingSpinnerModule,
        MatTooltipModule,
        MatFormFieldModule,
        MatOptionModule,
        MatSelectModule,
        HeaderModule,
        OwlModule,
        SafeHtmlModule,
        CardModule,
        TranslateModule,
        TableModule
    ]
})
export class CustTemplatesModule {

}