import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/modules/common/shared.module';
import { SearchMoreoptionsModule } from '../../../shared/modules/search-moreoptions/search-moreoptions.module';
import { SearchDataStorageService  } from '../../services/search-datastorage.services';
import { SearchComponent } from './search.component';
import { SearchPopularMoreoptionsModule } from '../../../shared/modules/search-popular-moreoptions/search-popular-moreoptions.module';
import { OwlModule } from 'ngx-owl-carousel';
import {  TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { projectConstants } from '../../../app.component';
export function homeHttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, projectConstants.PATH+'assets/i18n/home/', '.json');
}
@NgModule({
    imports: [
      SharedModule,
      SearchMoreoptionsModule,
      SearchPopularMoreoptionsModule,
      OwlModule,
      HttpClientModule,
      TranslateModule.forChild({
        loader: {
            provide: TranslateLoader,
            useFactory: homeHttpLoaderFactory,
            deps: [HttpClient]
        },
    })
    ],
    declarations: [SearchComponent],
    exports: [SearchComponent],
    providers: [SearchDataStorageService]
})

export class SearchModule {
}
