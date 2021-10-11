import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatRadioModule } from "@angular/material/radio";
import { RouterModule, Routes } from "@angular/router";
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
        MatButtonModule,
        [RouterModule.forChild(routes)]
    ],
    exports: [JDNComponent],
    declarations: [
        JDNComponent
    ]
})
export class JDNModule {}