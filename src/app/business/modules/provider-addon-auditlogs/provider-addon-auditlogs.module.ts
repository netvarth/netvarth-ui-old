import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { ProviderAddonAuditlogsComponent } from "./provider-addon-auditlogs.component";

@NgModule({
    declarations: [ProviderAddonAuditlogsComponent],
    exports: [ProviderAddonAuditlogsComponent],
    imports: [
        CommonModule,
        MatDialogModule
    ]
})
export class ProviderAddonAuditlogsModule{}