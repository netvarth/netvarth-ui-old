import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { RouterModule, Routes } from "@angular/router";
import { ScrollToModule } from "@nicky-lenaers/ngx-scroll-to";
import { OwlModule } from "ngx-owl-carousel";
import { Nl2BrPipeModule } from "nl2br-pipe";
import { LoadingSpinnerModule } from "../../modules/loading-spinner/loading-spinner.module";
import { SearchModule } from "../../modules/search/search.module";
import { LoginModule } from "../login/login.module";
import { HomeComponent } from "./home.component";
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
        LoginModule
    ],
    exports: [HomeComponent],
    declarations: [HomeComponent]
})
export class HomeModule {}