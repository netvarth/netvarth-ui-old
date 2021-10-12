import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { RouterModule } from "@angular/router";
import { NgxIntlTelInputModule } from "ngx-intl-tel-input";
import { FormMessageDisplayModule } from "../../modules/form-message-display/form-message-display.module";
import { LoadingSpinnerModule } from "../../modules/loading-spinner/loading-spinner.module";
import { OtpFormModule } from "../../modules/otp-form/otp-form.module";
import { SetPasswwordModule } from "../set-password-form/set-password-form.module";
import { SignUpComponent } from "./signup.component";

@NgModule({
    imports: [
        CommonModule,
        MatDialogModule,
        NgxIntlTelInputModule,
        MatFormFieldModule,
        MatCheckboxModule,
        MatButtonModule,
        ReactiveFormsModule,
        FormMessageDisplayModule,
        LoadingSpinnerModule,
        OtpFormModule,
        SetPasswwordModule,
        RouterModule
    ],
    exports: [SignUpComponent],
    declarations: [SignUpComponent]
})
export class SignupModule {}