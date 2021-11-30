import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatChipsModule } from "@angular/material/chips";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatRadioModule } from "@angular/material/radio";
import { MatStepperModule } from "@angular/material/stepper";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ConsumerJoinModule } from "../../../../ynw_consumer/components/consumer-join/join.component.module";
import { ConfirmBoxModule } from "../../../../shared/components/confirm-box/confirm-box.module";
import { ShoppingListUploadModule } from "../../../../shared/components/shoppinglistupload/shoppinglistupload.module";
import { FormMessageDisplayModule } from "../../form-message-display/form-message-display.module";
import { GalleryModule as ModalGalleryModule } from '@ks89/angular-modal-gallery';
import { HeaderModule } from "../../header/header.module";
import { LoadingSpinnerModule } from "../../loading-spinner/loading-spinner.module";
import { AddAddressModule } from "./add-address/add-address.module";
import { CheckoutComponent } from "./checkout.component";
import { JcCouponNoteModule } from "../../jc-coupon-note/jc-coupon-note.module";
import { RouterModule, Routes } from "@angular/router";
import { MatMomentDateModule } from '@angular/material-moment-adapter';
const routes: Routes = [
    {path: '', component: CheckoutComponent}
]
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MatStepperModule,
        MatRadioModule,
        MatGridListModule,
        MatChipsModule,
        MatDatepickerModule,
        MatMomentDateModule,
        MatButtonModule,
        MatTooltipModule,
        MatCheckboxModule,
        HeaderModule,
        AddAddressModule,
        ConfirmBoxModule,
        ConsumerJoinModule,
        JcCouponNoteModule,
        ShoppingListUploadModule,
        LoadingSpinnerModule,
        FormMessageDisplayModule,
        ReactiveFormsModule,
        ModalGalleryModule.forRoot({ shortcuts: ['ctrl+s', 'meta+s'], disableSsrWorkaround: true }),
        [RouterModule.forChild(routes)]
    ],
    exports: [CheckoutComponent],
    declarations: [
        CheckoutComponent
    ]
})
export class CheckoutModule {}