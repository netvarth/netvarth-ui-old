import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { NgxIntlTelInputModule } from "ngx-intl-tel-input";
import { FormMessageDisplayModule } from "../../modules/form-message-display/form-message-display.module";
import { LoadingSpinnerModule } from "../../modules/loading-spinner/loading-spinner.module";
import { ForgotPasswordModule } from "../forgot-password/forgot-password.module";
import { SignupModule } from "../signup/signup.module";
import { LoginComponent } from "./login.component";

@NgModule({
    imports: [
        CommonModule,
        MatDialogModule,
        ReactiveFormsModule,
        NgxIntlTelInputModule,
        MatFormFieldModule,
        MatButtonModule,
        FormMessageDisplayModule,
        LoadingSpinnerModule,
        ForgotPasswordModule,
        SignupModule
    ],
    exports: [LoginComponent],
    declarations: [LoginComponent]
})
export class LoginModule {}