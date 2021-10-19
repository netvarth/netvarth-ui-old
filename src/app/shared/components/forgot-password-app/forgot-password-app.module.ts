import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { FormMessageDisplayModule } from "../../modules/form-message-display/form-message-display.module";
import { ForgotPasswordAppComponent } from "./forgot-password-app.component";

@NgModule({
    declarations: [ForgotPasswordAppComponent],
    exports: [ForgotPasswordAppComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormMessageDisplayModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule
    ]
})
export class ForgotPasswordAppModule{}