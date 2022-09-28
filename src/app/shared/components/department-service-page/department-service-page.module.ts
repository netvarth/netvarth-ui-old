import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { LoadingSpinnerModule } from "../../modules/loading-spinner/loading-spinner.module";
import { CardModule } from "../card/card.module";
import { DepartmentServicePageComponent } from "./department-service-page.component";
import { GalleryModule } from "@ks89/angular-modal-gallery";
import { RouterModule, Routes } from "@angular/router";
import { HeaderModule } from "../../modules/header/header.module";
import { CheckavailabilityModule } from "../checkavailability/checkavaiablity.module";
import { DomainConfigGenerator } from "../../services/domain-config-generator.service";
import { SafeHtmlModule } from "../../pipes/safe-html/safehtml.module";
import { MatButtonModule } from "@angular/material/button";
import { BasicProfileModule } from "../../../custom-app/basic-profile/basic-profile.module";
const routes: Routes = [
    {path: '', component: DepartmentServicePageComponent}
];
@NgModule({
    imports:[
        CommonModule,
        CardModule,
        LoadingSpinnerModule,
        GalleryModule,
        HeaderModule,
        CheckavailabilityModule,
        SafeHtmlModule,
        MatButtonModule,
        BasicProfileModule,
        [RouterModule.forChild(routes)]
    ],
    exports:[
        DepartmentServicePageComponent
    ],
    declarations:[
        DepartmentServicePageComponent
    ],
    providers: [
        DomainConfigGenerator
    ]
})
export class DepartmentServicePageModule {}