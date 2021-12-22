import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { OwlModule } from "ngx-owl-carousel";
import { ConsumerJoinModule } from "../../../ynw_consumer/components/consumer-join/join.component.module";
import { HeaderModule } from "../../modules/header/header.module";
import { LoadingSpinnerModule } from "../../modules/loading-spinner/loading-spinner.module";
import { ConfirmBoxModule } from "../confirm-box/confirm-box.module";
import { ItemDetailsSharedComponent } from "./item-details.component";
const routes: Routes = [
    { path: '', component: ItemDetailsSharedComponent}
]
@NgModule({
    imports: [
        [RouterModule.forChild(routes)],
        CommonModule,
        OwlModule,
        LoadingSpinnerModule,
        HeaderModule,
        ConsumerJoinModule,
        ConfirmBoxModule
    ],
    exports: [
        ItemDetailsSharedComponent
    ],
    declarations: [
        ItemDetailsSharedComponent
    ]
})
export class ItemDetailsModule {}