import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ProviderAddonAuditlogsModule } from "../../provider-addon-auditlogs/provider-addon-auditlogs.module";
import { AddonsComponent } from "./addons.component";
const routes: Routes = [
    {path: '', component: AddonsComponent}
]
@NgModule({
    declarations: [AddonsComponent],
    exports: [AddonsComponent],
    imports: [
        CommonModule,
        ProviderAddonAuditlogsModule,
        RouterModule.forChild(routes)
    ]
})
export class AddonsModule{}