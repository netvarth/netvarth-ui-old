import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { RouterModule, Routes } from "@angular/router";
import { FormMessageDisplayModule } from "../../modules/form-message-display/form-message-display.module";
import { LoadingSpinnerModule } from "../../modules/loading-spinner/loading-spinner.module";
import { ForgotPasswordAppModule } from "../forgot-password-app/forgot-password-app.module";
import { HomeAppComponent } from "./home-app.component";
const routes: Routes = [
    {path: '', component: HomeAppComponent}
]
@NgModule({
    imports: [
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        CommonModule,
        LoadingSpinnerModule,
        ReactiveFormsModule,
        ForgotPasswordAppModule,
        FormMessageDisplayModule,
        [RouterModule.forChild(routes)]
    ],
    exports: [HomeAppComponent],
    declarations: [
        HomeAppComponent
    ]
})
export class HomeAppModule {}