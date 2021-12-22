import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { GalleryModule } from "../../../../../../shared/modules/gallery/gallery.module";
import { LoadingSpinnerModule } from "../../../../../../shared/modules/loading-spinner/loading-spinner.module";
import { ServiceModule } from "../../../../../../shared/modules/service/service.module";
import { WaitlistServiceDetailComponent } from "./waitlistservice-detail.component";
const routes: Routes = [
    { path: '', component: WaitlistServiceDetailComponent }
];
@NgModule({
    imports: [
        CommonModule,
        LoadingSpinnerModule,
        ServiceModule,
        GalleryModule,
        [RouterModule.forChild(routes)]
    ],
    exports: [WaitlistServiceDetailComponent],
    declarations: [WaitlistServiceDetailComponent]
})
export class WaitlistserviceDetailModule {}