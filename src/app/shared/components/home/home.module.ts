import { CommonModule } from "@angular/common";
import { NgModule } from '@angular/core';
import {HomeComponent} from "./home.component";
import { HomeRoutingModule } from "./home.routing.module";
import { OwlModule } from 'ngx-owl-carousel';
import { FormsModule } from '@angular/forms'; 
import { LoadingSpinnerModule } from '../../../shared/modules/loading-spinner/loading-spinner.module';
import { SearchModule } from '../../../shared/modules/search/search.module';
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import {MatSelectModule} from '@angular/material/select';
export function homeHttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/home/', '.json');
  }

@NgModule({
    declarations: [
        HomeComponent
    ],
    imports: [
        CommonModule,
        HomeRoutingModule,
        OwlModule,
        FormsModule,
        HttpClientModule,
        MatSelectModule,
        LoadingSpinnerModule,
        SearchModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: homeHttpLoaderFactory,
                deps: [HttpClient]
            },
            isolate: false,
            extend: true
        })


    ],
    exports: [
        HomeComponent
    ],
})
export class HomeModule {

}