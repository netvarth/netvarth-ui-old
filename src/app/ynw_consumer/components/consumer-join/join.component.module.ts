import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { NgxIntlTelInputModule } from "ngx-intl-tel-input";
import { LoadingSpinnerModule } from "../../../shared/modules/loading-spinner/loading-spinner.module";
import { FormMessageDisplayModule } from "../../../shared/modules/form-message-display/form-message-display.module";
import { ConsumerJoinComponent } from "./join.component";
import { ForgotPasswordModule } from "../../../shared/components/forgot-password/forgot-password.module";
import { OtpFormModule } from "../../../shared/modules/otp-form/otp-form.module";
import { SetPasswwordModule } from "../../../shared/components/set-password-form/set-password-form.module";
import { CommonModule } from "@angular/common";

@NgModule({
    imports: [
        CommonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatButtonModule,
        ReactiveFormsModule,
        NgxIntlTelInputModule,
        FormMessageDisplayModule,
        LoadingSpinnerModule,
        ForgotPasswordModule,
        OtpFormModule,
        SetPasswwordModule
    ],
    exports: [
        ConsumerJoinComponent
    ],
    declarations: [
        ConsumerJoinComponent
    ]
})
export class ConsumerJoinModule {}