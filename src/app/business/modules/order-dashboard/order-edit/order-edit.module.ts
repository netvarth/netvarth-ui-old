import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatChipsModule } from "@angular/material/chips";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatRadioModule } from "@angular/material/radio";
import { FormMessageDisplayModule } from "../../../../shared/modules/form-message-display/form-message-display.module";
import { LoadingSpinnerModule } from "../../../../shared/modules/loading-spinner/loading-spinner.module";
import { OrderItemsModule } from "../order-items/order-items.module";
import { OrderEditComponent } from "./order-edit.component";
import { GalleryModule as ModalGalleryModule } from '@ks89/angular-modal-gallery';
import { RouterModule, Routes } from "@angular/router";
const routes: Routes = [
    {path: '', component: OrderEditComponent}
]
@NgModule({
    declarations: [OrderEditComponent],
    exports: [OrderEditComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        LoadingSpinnerModule,
        FormMessageDisplayModule,
        MatRadioModule,
        MatDatepickerModule,
        MatChipsModule,
        OrderItemsModule,
        FormsModule,
        [RouterModule.forChild(routes)],
        ModalGalleryModule.forRoot({ shortcuts: ['ctrl+s', 'meta+s'], disableSsrWorkaround: true }),
    ]
})
export class OrderEditModule{}