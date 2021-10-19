import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { GalleryModule } from "../../../../../../shared/modules/gallery/gallery.module";
import { LoadingSpinnerModule } from "../../../../../../shared/modules/loading-spinner/loading-spinner.module";
import { WaitlistServiceDetailComponent } from "./waitlistservice-detail.component";
import { ServiceModule } from "../../../../../../shared/modules/service/service.module";
import { RouterModule, Routes } from "@angular/router";
const routes: Routes = [
    { path: '', component: WaitlistServiceDetailComponent }
]
@NgModule({
    declarations: [WaitlistServiceDetailComponent],
    exports: [WaitlistServiceDetailComponent],
    imports: [
        CommonModule,
        LoadingSpinnerModule,
        ServiceModule,
        GalleryModule,
        [RouterModule.forChild(routes)]
    ]
})
export class WaitlistServiceDetailModule{}