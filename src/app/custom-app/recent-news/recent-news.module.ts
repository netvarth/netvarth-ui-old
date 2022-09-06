import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { SafeHtmlModule } from "../../shared/pipes/safe-html/safehtml.module";
import { RecentNewsComponent } from "./recent-news.component";
import { OwlModule } from "ngx-owl-carousel";
@NgModule({
    declarations: [
        RecentNewsComponent
    ],
    imports: [
        CommonModule,
        OwlModule,
        SafeHtmlModule
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
      ],
    exports: [
        RecentNewsComponent
    ]
})

export class RecentNewsModule {}