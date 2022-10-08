import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { FileService } from "../../../shared/services/file-service";
import { HeaderModule } from "../../../shared/modules/header/header.module";
import { LoadingSpinnerModule } from "../../../shared/modules/loading-spinner/loading-spinner.module";
import { PrescriptionsComponent } from "./prescriptions.component";
import { MatDialogModule } from "@angular/material/dialog";
import { PreviewuploadedfilesModule } from "../../../business/modules/jaldee-drive/previewuploadedfiles/previewuploadedfiles.module";
const routes: Routes = [
    { path: '', component: PrescriptionsComponent }
];
@NgModule({
    declarations: [
        PrescriptionsComponent
    ],
    imports: [
        CommonModule,
        LoadingSpinnerModule,
        MatDialogModule,
        HeaderModule,
        PreviewuploadedfilesModule,
        [RouterModule.forChild(routes)]
    ],
    exports: [
        PrescriptionsComponent
    ],
    providers: [
        FileService
    ]
})
export class PrescriptionsModule {}