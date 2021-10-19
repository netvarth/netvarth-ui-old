import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { RouterModule, Routes } from "@angular/router";
import { CapitalizeFirstPipeModule } from "../../../../shared/pipes/capitalize.module";
import { HeaderModule } from "../../../../shared/modules/header/header.module";
import { LoadingSpinnerModule } from "../../../../shared/modules/loading-spinner/loading-spinner.module";
import { OrderHistoryComponent } from "./order-history.component";
const routes: Routes= [
    {path: '', component: OrderHistoryComponent}
]
@NgModule({
    declarations: [OrderHistoryComponent],
    exports: [OrderHistoryComponent],
    imports: [
        CommonModule,
        MatDialogModule,
        HeaderModule,
        LoadingSpinnerModule,
        MatIconModule,
        MatMenuModule,
        MatButtonModule,
        CapitalizeFirstPipeModule,
        [RouterModule.forChild(routes)]
    ]
})
export class OrderHistoryModule{}