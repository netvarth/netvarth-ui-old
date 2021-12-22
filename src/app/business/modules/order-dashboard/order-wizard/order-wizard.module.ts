import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatChipsModule } from "@angular/material/chips";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { MatRadioModule } from "@angular/material/radio";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ConfirmBoxModule } from "../../../../shared/components/confirm-box/confirm-box.module";
import { ShoppingListUploadModule } from "../../../../shared/components/shoppinglistupload/shoppinglistupload.module";
import { AddressModule } from "./address/address.module";
import { ContactInfoModule } from "./contact-info/contact-info.module";
import { OrderWizardComponent } from "./order-wizard.component";
import { GalleryModule as ModalGalleryModule } from '@ks89/angular-modal-gallery';
import { CapitalizeFirstPipeModule } from "../../../../shared/pipes/capitalize.module";
import { RouterModule, Routes } from "@angular/router";
const routes: Routes = [
    {path: '', component: OrderWizardComponent}
]
@NgModule({
    declarations: [OrderWizardComponent],
    exports: [OrderWizardComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatDialogModule,
        ContactInfoModule,
        AddressModule,
        ShoppingListUploadModule,
        ConfirmBoxModule,
        MatTooltipModule,
        MatRadioModule,
        MatDatepickerModule,
        MatChipsModule,
        CapitalizeFirstPipeModule,
        ModalGalleryModule.forRoot({ shortcuts: ['ctrl+s', 'meta+s'], disableSsrWorkaround: true }),
        [RouterModule.forChild(routes)]
    ]
})
export class OrderWizardModule{}