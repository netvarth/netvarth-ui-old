import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatOptionModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { RouterModule, Routes } from "@angular/router";
import { ConsumerGroupDialogModule } from "../../../../../../business/shared/consumer-group-dialog/consumer-group-dialog.module";
import { ConsumerLabelDialogModule } from "../../../../../../business/shared/consumer-label-dialog/consumer-label-dialog.module";
import { DepartmentListDialogModule } from "../../../../../../business/shared/department-list-dialog/department-list-dialog.module";
import { ItemListDialogModule } from "../../../../../../business/shared/item-list-dialog/item-list-dialog.module";
import { ServiceListDialogModule } from "../../../../../../business/shared/service-list-dialog/service-list-dialog.module";
import { UsersListDialogModule } from "../../../../../../business/shared/users-list-dialog/users-list-dialog.module";
import { FormMessageDisplayModule } from "../../../../../../shared/modules/form-message-display/form-message-display.module";
import { TimewindowPopupModule } from "../../../ordermanager/catalog/timewindowpopup/timewindowpopup.module";
import { CreateCouponComponent } from "./create-coupon.component";
const routes: Routes = [
    {path: '', component: CreateCouponComponent}
]
@NgModule({
    declarations: [CreateCouponComponent],
    exports: [CreateCouponComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatRadioModule,
        MatDatepickerModule,
        MatInputModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatSelectModule,
        MatOptionModule,
        FormMessageDisplayModule,
        ConsumerGroupDialogModule,
        ConsumerLabelDialogModule,
        UsersListDialogModule,
        ServiceListDialogModule,
        ItemListDialogModule,
        DepartmentListDialogModule,
        TimewindowPopupModule,
        [RouterModule.forChild(routes)]
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
    ]
})
export class CreateCouponModule{}