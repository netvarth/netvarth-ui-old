import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { MatGridListModule } from "@angular/material/grid-list";
import { RouterModule, Routes } from "@angular/router";
import { ConfirmBoxModule } from "../../../../../shared/components/confirm-box/confirm-box.module";
import { AddonDetailComponent } from "./addon-detail.component";
const routes: Routes = [
    {path: '', component: AddonDetailComponent}
]
@NgModule({
    declarations: [AddonDetailComponent],
    exports: [AddonDetailComponent],
    imports: [
        CommonModule,
        MatDialogModule,
        ConfirmBoxModule,
        MatGridListModule,
        [RouterModule.forChild(routes)]
    ]
})
export class AddonDetailModule{}