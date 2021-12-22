import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatTabsModule } from "@angular/material/tabs";
import { RouterModule, Routes } from "@angular/router";
import { LoadingSpinnerModule } from "../../../../shared/modules/loading-spinner/loading-spinner.module";
import { ConfirmBoxModule } from "../../../../shared/components/confirm-box/confirm-box.module";
import { MrfileuploadpopupModule } from "./mrfileuploadpopup/mrfileuploadpopup.module";
import { ShowuploadfileModule } from "./showuploadfile/showuploadfile.module";
import { UploadFileComponent } from "./uploadfile.component";
import { CapitalizeFirstPipeModule } from "../../../../shared/pipes/capitalize.module";
const routes: Routes = [
    { path: '', component: UploadFileComponent}
]
@NgModule({
    imports: [
        CommonModule,
        ShowuploadfileModule,
        MrfileuploadpopupModule,
        MatIconModule,
        MatMenuModule,
        MatButtonModule,
        MatTabsModule,
        ConfirmBoxModule,
        LoadingSpinnerModule,
        CapitalizeFirstPipeModule,
        [RouterModule.forChild(routes)]
    ],
    exports: [UploadFileComponent],
    declarations: [UploadFileComponent]
})
export class UploadfileModule {}