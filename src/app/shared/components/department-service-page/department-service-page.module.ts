import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { LoadingSpinnerModule } from "../../modules/loading-spinner/loading-spinner.module";
import { CardModule } from "../card/card.module";
import { DepartmentServicePageComponent } from "./department-service-page.component";
import { GalleryModule } from "@ks89/angular-modal-gallery";
import { RouterModule, Routes } from "@angular/router";
import { HeaderModule } from "../../modules/header/header.module";
import { CheckavailabilityModule } from "../checkavailability/checkavaiablity.module";
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
        [RouterModule.forChild(routes)]
    ],
    exports:[
        DepartmentServicePageComponent
    ],
    declarations:[
        DepartmentServicePageComponent
    ]
})
export class DepartmentServicePageModule {}