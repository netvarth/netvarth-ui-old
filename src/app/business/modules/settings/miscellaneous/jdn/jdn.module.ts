import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatRadioModule } from "@angular/material/radio";
import { RouterModule, Routes } from "@angular/router";
import { ConfirmBoxModule } from "../../../../../ynw_provider/shared/component/confirm-box/confirm-box.module";
import { JDNComponent } from "./jdn.component";
const routes: Routes = [
    { path: '', component: JDNComponent },
];
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MatInputModule,
        MatRadioModule,
        ConfirmBoxModule,
        MatButtonModule,
        [RouterModule.forChild(routes)]
    ],
    exports: [JDNComponent],
    declarations: [
        JDNComponent
    ]
})
export class JDNModule {}