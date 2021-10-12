import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { FormMessageDisplayModule } from "../../modules/form-message-display/form-message-display.module";
import { LoadingSpinnerModule } from "../../modules/loading-spinner/loading-spinner.module";
import { ForgotPasswordModule } from "../forgot-password/forgot-password.module";
import { HomeAppComponent } from "./home-app.component";

@NgModule({
    imports: [
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        CommonModule,
        LoadingSpinnerModule,
        ReactiveFormsModule,
        ForgotPasswordModule,
        FormMessageDisplayModule
    ],
    exports: [HomeAppComponent],
    declarations: [
        HomeAppComponent
    ]
})
export class HomeAppModule {}