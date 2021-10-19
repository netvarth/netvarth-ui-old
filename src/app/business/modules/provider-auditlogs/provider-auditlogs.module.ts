import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { LoadingSpinnerModule } from "../../../shared/modules/loading-spinner/loading-spinner.module";
import { ProviderAuditLogComponent } from "./provider-auditlogs.component";

@NgModule({
    declarations: [ProviderAuditLogComponent],
    exports: [ProviderAuditLogComponent],
    imports: [
        CommonModule,
        MatDialogModule,
        LoadingSpinnerModule
    ]
})
export class ProviderAuditLogModule{}