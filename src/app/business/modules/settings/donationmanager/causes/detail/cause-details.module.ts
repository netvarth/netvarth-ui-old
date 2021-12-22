import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { GalleryService } from "../../../../../../shared/modules/gallery/galery-service";
import { LoadingSpinnerModule } from "../../../../../../shared/modules/loading-spinner/loading-spinner.module";
import { ServiceModule } from "../../../../../../shared/modules/service/service.module";
import { CauseDetailComponent } from "./cause-details.component";
const routes: Routes = [
    {path: '', component: CauseDetailComponent}
]
@NgModule({
    declarations: [CauseDetailComponent],
    exports: [CauseDetailComponent],
    imports: [
        CommonModule,
        ServiceModule,
        LoadingSpinnerModule,
        [RouterModule.forChild(routes)]
    ],
    providers: [GalleryService]
})
export class CauseDetailModule{}