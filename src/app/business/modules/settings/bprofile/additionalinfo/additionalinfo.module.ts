import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { LoadingSpinnerModule } from "../../../../../shared/modules/loading-spinner/loading-spinner.module";
import { BreadCrumbModule } from "../../../../../shared/modules/breadcrumb/breadcrumb.module";
import { AdditionalInfoComponent } from "./additionalinfo.component";
import { RouterModule, Routes } from "@angular/router";
import { CapitalizeFirstPipeModule } from "../../../../../shared/pipes/capitalize.module";
import { Nl2BrPipeModule } from "nl2br-pipe";
import { DateFormatPipeModule } from "../../../../../shared/pipes/date-format/date-format.module";
import { CommonModule } from "@angular/common";
import { ProviderBprofileSearchDynamicModule } from "../../../provider-bprofile-search-dynamic/provider-bprofile-search-dynamic.module";
const routes: Routes = [
    { path: '', component: AdditionalInfoComponent }
]
@NgModule({
    declarations: [AdditionalInfoComponent],
    exports: [AdditionalInfoComponent],
    imports: [
        CommonModule,
        ProviderBprofileSearchDynamicModule,
        MatDialogModule,
        BreadCrumbModule,
        MatExpansionModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        LoadingSpinnerModule,
        CapitalizeFirstPipeModule,
        Nl2BrPipeModule,
        DateFormatPipeModule,
        [RouterModule.forChild(routes)]
    ]
})
export class AdditionalInfoModule {}