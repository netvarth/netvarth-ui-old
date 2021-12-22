import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { CapitalizeFirstPipeModule } from "../../../../../../shared/pipes/capitalize.module";
import { ConsumerGroupDialogModule } from "../../../../../../business/shared/consumer-group-dialog/consumer-group-dialog.module";
import { ConsumerLabelDialogModule } from "../../../../../../business/shared/consumer-label-dialog/consumer-label-dialog.module";
import { DepartmentListDialogModule } from "../../../../../../business/shared/department-list-dialog/department-list-dialog.module";
import { ItemListDialogModule } from "../../../../../../business/shared/item-list-dialog/item-list-dialog.module";
import { ServiceListDialogModule } from "../../../../../../business/shared/service-list-dialog/service-list-dialog.module";
import { UsersListDialogModule } from "../../../../../../business/shared/users-list-dialog/users-list-dialog.module";
import { PublishCouponComponent } from "./publish-coupon.component";
import { PublishDialogModule } from "./publish-dialog/publish-dialog.module";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { LoadingSpinnerModule } from "../../../../../../shared/modules/loading-spinner/loading-spinner.module";
import { RouterModule, Routes } from "@angular/router";
const routes: Routes = [
    {path: '', component: PublishCouponComponent}
]
@NgModule({
    declarations: [PublishCouponComponent],
    exports: [PublishCouponComponent],
    imports: [
        CommonModule,
        MatCheckboxModule,
        LoadingSpinnerModule,
        CapitalizeFirstPipeModule,
        ConsumerGroupDialogModule,
        ConsumerLabelDialogModule,
        UsersListDialogModule,
        ServiceListDialogModule,
        ItemListDialogModule,
        DepartmentListDialogModule,
        PublishDialogModule,
        [RouterModule.forChild(routes)]
    ]
})
export class PublishCouponModule {}