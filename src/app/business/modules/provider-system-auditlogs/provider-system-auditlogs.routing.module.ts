import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ProviderSystemAuditLogComponent } from "./provider-system-auditlogs.component";

const routes: Routes = [
    { path: '', component: ProviderSystemAuditLogComponent }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProviderSystemAuditlogsRoutingModule{}