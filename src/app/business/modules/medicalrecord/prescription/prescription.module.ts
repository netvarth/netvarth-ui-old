import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { LoadingSpinnerModule } from "../../../../shared/modules/loading-spinner/loading-spinner.module";
import { AddDrugModule } from "./add-drug/add-drug.module";
import { AddNoteModule } from "./add-note/add-note.module";
import { ImagesViewModule } from "./imagesview/imagesview.module";
import { InstructionsModule } from "./instructions/instructions.module";
import { PrescriptionComponent } from "./prescription.component";
import { ShareRxModule } from "./share-rx/share-rx.module";
import { GalleryModule as ModalGalleryModule } from '@ks89/angular-modal-gallery';
// import { addPrescriptionComponent } from "./add-prescription.component";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import {  MatTableModule } from "@angular/material/table";
import { CapitalizeFirstPipeModule } from "../../../../shared/pipes/capitalize.module";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatMenuModule} from '@angular/material/menu';
import { MatIconModule } from "@angular/material/icon";
import { PdfViewerModule } from 'ng2-pdf-viewer'; // <- import PdfViewerModule


const routes: Routes = [
    { path: '', component: PrescriptionComponent}
]
@NgModule({
    imports: [
        CommonModule,
        MatDialogModule,
        LoadingSpinnerModule,
        ShareRxModule,
        AddDrugModule,
        AddNoteModule,
        ImagesViewModule,
        InstructionsModule,
        MatButtonModule,
        ReactiveFormsModule,
        CapitalizeFirstPipeModule,
        MatTableModule,
        MatTooltipModule,
        MatMenuModule,
        MatIconModule,
        PdfViewerModule,
        [RouterModule.forChild(routes)],
        ModalGalleryModule.forRoot({ shortcuts: ['ctrl+s', 'meta+s'], disableSsrWorkaround: true })
    ],
    exports: [PrescriptionComponent],
    declarations: [ PrescriptionComponent ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
    ]
})
export class PrescriptionModule {}