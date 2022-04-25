import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { LoadingSpinnerModule } from "../../../../shared/modules/loading-spinner/loading-spinner.module";
import { ConfirmBoxModule } from "../../../../business/shared/confirm-box/confirm-box.module";
import { FolderFilesComponent } from "./folder-files.component";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import {NgxPaginationModule} from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter'; // import ng2search pipe module
import { CapitalizeFirstPipeModule } from "../../../../shared/pipes/capitalize.module";
import { FileService } from "../../../../shared/services/file-service";


const routes: Routes = [
    { path: '', component: FolderFilesComponent }
]

@NgModule({
    imports:[
        ConfirmBoxModule,
        CommonModule,
        LoadingSpinnerModule,
        MatTooltipModule,
        MatCheckboxModule,
        FormsModule,
        NgxPaginationModule,
        Ng2SearchPipeModule,
        CapitalizeFirstPipeModule,
        [RouterModule.forChild(routes)]
    ],
    exports: [
        FolderFilesComponent
    ],
    declarations: [
        FolderFilesComponent
    ],
    providers: [
        FileService
    ]
})
export class FolderFileModule {}