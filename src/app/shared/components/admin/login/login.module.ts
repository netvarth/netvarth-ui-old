import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { FormMessageDisplayModule } from "../../../../shared/modules/form-message-display/form-message-display.module";
import { AdminLoginComponent } from "./login.component";
const routes: Routes = [
    { path: '', component: AdminLoginComponent}
]
@NgModule({
    imports: [
        [RouterModule.forChild(routes)],
        CommonModule,
        FormsModule,
        FormMessageDisplayModule
    ],
    declarations: [
        AdminLoginComponent
    ],
    exports: [
        AdminLoginComponent
    ]
})
export class AdminLoginModule {}