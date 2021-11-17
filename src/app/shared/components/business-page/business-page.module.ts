import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { MatTooltipModule } from "@angular/material/tooltip";
import { GalleryModule } from "@ks89/angular-modal-gallery";
import { Nl2BrPipeModule } from "nl2br-pipe";
import { LoadingSpinnerModule } from "../../../shared/modules/loading-spinner/loading-spinner.module"
import { CapitalizeFirstPipeModule } from "../../pipes/capitalize.module";
import { BusinessPageComponent } from "./business-page.component";
import { BusinessPageRoutingModule } from "./business-page.routing.module";
import { CardModule } from "../card/card.module"
import { HeaderModule } from "../../../shared/modules/header/header.module";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { projectConstantsLocal } from "../../constants/project-constants";
export function homeHttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http,projectConstantsLocal.PATH+ './assets/i18n/home/', '.json');
  }
@NgModule({
    imports: [
        CommonModule,
        BusinessPageRoutingModule,
        Nl2BrPipeModule,
        CapitalizeFirstPipeModule,
        MatTooltipModule,
        GalleryModule,
        LoadingSpinnerModule,
        CardModule,
        HeaderModule,
        HttpClientModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: homeHttpLoaderFactory,
                deps: [HttpClient]
            },
            isolate: false,
            // extend: true
        })
    ],
    declarations: [
        BusinessPageComponent,
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
    ],
    exports: [BusinessPageComponent]
})
export class BusinessPageModule {

}