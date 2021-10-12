import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
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
import { HeaderModule } from "../../header/header.module";
import { LoadingSpinnerModule } from "../../loading-spinner/loading-spinner.module";
import { AddAddressModule } from "./add-address/add-address.module";
import { CheckoutComponent } from "./checkout.component";
import { JcCouponNoteModule } from "../../../../ynw_provider/components/jc-coupon-note/jc-coupon-note.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MatStepperModule,
        MatRadioModule,
        MatGridListModule,
        MatChipsModule,
        MatDatepickerModule,
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
        ConfirmBoxModule
    ],
    exports: [CheckoutComponent],
    declarations: [
        CheckoutComponent
    ]
})
export class CheckoutModule {}