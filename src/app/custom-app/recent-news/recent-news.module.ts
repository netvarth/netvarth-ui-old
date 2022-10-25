import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { SafeHtmlModule } from "../../shared/pipes/safe-html/safehtml.module";
import { RecentNewsComponent } from "./recent-news.component";
import { OwlModule } from "ngx-owl-carousel";
import {  TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { projectConstantsLocal } from '../../shared/constants/project-constants';
export function homeHttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, projectConstantsLocal.PATH+'assets/i18n/home/', '.json');
}
@NgModule({
    declarations: [
        RecentNewsComponent
    ],
    imports: [
        CommonModule,
        OwlModule,
        SafeHtmlModule,
        HttpClientModule,
    TranslateModule.forChild({
      loader: {
          provide: TranslateLoader,
          useFactory: homeHttpLoaderFactory,
          deps: [HttpClient]
      },
  })
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