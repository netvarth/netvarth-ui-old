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
// import { RouterModule, Routes } from "@angular/router";
// const routes: Routes = [
//     { path: '', component: PrescriptionComponent}
// ]
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
        // [RouterModule.forChild(routes)],
        ModalGalleryModule.forRoot({ shortcuts: ['ctrl+s', 'meta+s'], disableSsrWorkaround: true })
    ],
    exports: [PrescriptionComponent],
    declarations: [ PrescriptionComponent ]
})
export class PrescriptionModule {}