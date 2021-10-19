import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { FormMessageDisplayModule } from "../form-message-display/form-message-display.module";
import { OtpFormAppComponent } from "./otp-form-app.component";

@NgModule({
    declarations: [OtpFormAppComponent],
    exports: [OtpFormAppComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormMessageDisplayModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule
    ]
})
export class OtpFormAppModule{}