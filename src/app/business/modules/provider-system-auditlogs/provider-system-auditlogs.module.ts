import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatTooltipModule } from "@angular/material/tooltip";
import { RouterModule, Routes } from "@angular/router";
import { LoadingSpinnerModule } from "../../../shared/modules/loading-spinner/loading-spinner.module";
import { PagerModule } from "../../../shared/modules/pager/pager.module";
import { ProviderSystemAuditLogComponent } from "./provider-system-auditlogs.component";
const routes: Routes = [
    { path: '', component: ProviderSystemAuditLogComponent }
];
@NgModule({
    imports: [
        CommonModule,
        LoadingSpinnerModule,
        PagerModule,
        MatDatepickerModule,
        MatTooltipModule,
        FormsModule,
        [RouterModule.forChild(routes)]
    ],
    declarations: [
        ProviderSystemAuditLogComponent
    ],
    exports: [
        ProviderSystemAuditLogComponent
    ]
})
export class ProviderSystemAuditLogsModule {}