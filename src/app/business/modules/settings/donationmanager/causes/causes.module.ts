import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ServiceqrcodegeneratorModule } from "../../../../../shared/modules/service/serviceqrcodegenerator/serviceqrcodegeneratordetail.module";
import { FormMessageDisplayModule } from "../../../../../shared/modules/form-message-display/form-message-display.module";
import { LoadingSpinnerModule } from "../../../../../shared/modules/loading-spinner/loading-spinner.module";
import { DonationCauseListComponent } from "./causes.component";
import { OrderModule } from "ngx-order-pipe";
import { CapitalizeFirstPipeModule } from "../../../../../shared/pipes/capitalize.module";
import { RouterModule, Routes } from "@angular/router";
const routes: Routes = [
    {path: '', component: DonationCauseListComponent}
]
@NgModule({
    declarations: [DonationCauseListComponent],
    exports: [DonationCauseListComponent],
    imports: [
        CommonModule,
        MatDialogModule,
        FormMessageDisplayModule,
        LoadingSpinnerModule,
        MatTooltipModule,
        MatIconModule,
        MatMenuModule,
        MatButtonModule,
        ServiceqrcodegeneratorModule,
        OrderModule,
        CapitalizeFirstPipeModule,
        [RouterModule.forChild(routes)]
    ]
})
export class DonationCauseListModule{}