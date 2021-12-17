import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { RouterModule, Routes } from "@angular/router";
import { ScrollToModule } from "@nicky-lenaers/ngx-scroll-to";
import { OwlModule } from "ngx-owl-carousel";
import { Nl2BrPipeModule } from "nl2br-pipe";
import { LazyModule } from "../../modules/lazy-load/lazy.module";
import { LoadingSpinnerModule } from "../../modules/loading-spinner/loading-spinner.module";
import { SearchModule } from "../../modules/search/search.module";
import { LoginModule } from "../login/login.module";
import { HomeComponent } from "./home.component";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { projectConstantsLocal } from "../../constants/project-constants";
export function homeHttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http,projectConstantsLocal.PATH+ 'assets/i18n/home/', '.json');
  }
const routes: Routes = [
    {path: '', component: HomeComponent}
  ];
@NgModule({
    imports: [
        [RouterModule.forChild(routes)],
        MatDialogModule,
        CommonModule,
        Nl2BrPipeModule,
        OwlModule,
        ScrollToModule.forRoot(),
        LoadingSpinnerModule,
        SearchModule,
        LoginModule,
        LazyModule,
        HttpClientModule ,
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
    exports: [HomeComponent],
    declarations: [HomeComponent]
})
export class HomeModule {}