import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatOptionModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatTooltipModule } from "@angular/material/tooltip";
import { GalleryModule } from "@ks89/angular-modal-gallery";
import { TranslateModule } from "@ngx-translate/core";
import { OwlModule } from "ngx-owl-carousel";
import { CarouselModule } from "ngx-owl-carousel-o";
import { Nl2BrPipeModule } from "nl2br-pipe";
import { CardModule } from "../../shared/components/card/card.module";
import { HeaderModule } from "../../shared/modules/header/header.module";
import { LoadingSpinnerModule } from "../../shared/modules/loading-spinner/loading-spinner.module";
import { CapitalizeFirstPipeModule } from "../../shared/pipes/capitalize.module";
import { SafeHtmlModule } from "../../shared/pipes/safe-html/safehtml.module";
import { CustTemplate1Component } from "./cust-template1.component";

@NgModule({
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
        CarouselModule,
        SafeHtmlModule,
        CardModule,
        TranslateModule,
        OwlModule
    ],
    schemas: [
        NO_ERRORS_SCHEMA,
        CUSTOM_ELEMENTS_SCHEMA
    ],
    declarations: [CustTemplate1Component],
    exports: [CustTemplate1Component]
})
export class CustTemplate1Module {}