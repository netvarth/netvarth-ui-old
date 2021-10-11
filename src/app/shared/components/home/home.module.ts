import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { RouterModule } from "@angular/router";
import { ScrollToModule } from "@nicky-lenaers/ngx-scroll-to";
import { OwlModule } from "ngx-owl-carousel";
import { Nl2BrPipeModule } from "nl2br-pipe";
import { LoadingSpinnerModule } from "../../modules/loading-spinner/loading-spinner.module";
import { SearchModule } from "../../modules/search/search.module";
import { HomeComponent } from "./home.component";

@NgModule({
    imports: [
        RouterModule,
        MatDialogModule,
        CommonModule,
        Nl2BrPipeModule,
        OwlModule,
        ScrollToModule,
        LoadingSpinnerModule,
        SearchModule
    ],
    exports: [HomeComponent],
    declarations: [HomeComponent]
})
export class HomeModule {}