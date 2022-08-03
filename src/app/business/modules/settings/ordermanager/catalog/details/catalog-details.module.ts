import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatOptionModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { LoadingSpinnerModule } from "../../../../../../shared/modules/loading-spinner/loading-spinner.module";
import { FormMessageDisplayModule } from "../../../../../../shared/modules/form-message-display/form-message-display.module";
// import { TimewindowPopupModule } from "../timewindowpopup/timewindowpopup.module";
import { CatalogdetailComponent } from "./catalog-details.component";
import { AddcatalogimageModule } from "../addcatalogimage/addcatalogimage.module";
import { CreateItemPopupModule } from "../createItem/createItempopup.module";
import { EditCatalogItemPopupModule } from "../editcatalogitempopup/editcatalogitempopup.module";
import { RouterModule, Routes } from "@angular/router";
import { GalleryModule as ModalGalleryModule } from '@ks89/angular-modal-gallery';
import { TimewindowPopupModule } from "../timewindowpopup/timewindowpopup.module";
import { CapitalizeFirstPipeModule } from '../../../../../../shared/pipes/capitalize.module';


const routes: Routes = [
    {path: '', component: CatalogdetailComponent}
]
@NgModule({
    declarations: [CatalogdetailComponent],
    exports: [CatalogdetailComponent],
    imports: [
        CommonModule,
        MatInputModule,
        MatDatepickerModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatOptionModule,
        MatRadioModule,
        MatIconModule,
        MatMenuModule,
        MatButtonModule,
        MatSlideToggleModule,
        MatCheckboxModule,
        ModalGalleryModule.forRoot({ shortcuts: ['ctrl+s', 'meta+s'], disableSsrWorkaround: true }),
        TimewindowPopupModule,
        FormMessageDisplayModule,
        LoadingSpinnerModule,
        AddcatalogimageModule,
        CreateItemPopupModule,
        EditCatalogItemPopupModule,
        CapitalizeFirstPipeModule,
       
        [RouterModule.forChild(routes)]
    ]
})
export class CatalogdetailModule{}