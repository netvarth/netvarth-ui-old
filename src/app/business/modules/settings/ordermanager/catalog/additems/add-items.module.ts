import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { ConfirmBoxModule } from "../../../../../shared/confirm-box/confirm-box.module";
import { LoadingSpinnerModule } from "../../../../../../shared/modules/loading-spinner/loading-spinner.module";
import { AddItemsComponent } from "./additems.component";
import { EditCatalogItemPopupModule } from "../editcatalogitempopup/editcatalogitempopup.module";
import { RouterModule, Routes } from "@angular/router";
const routes: Routes = [
    {path: '', component:  AddItemsComponent}
]
@NgModule({
    declarations: [AddItemsComponent],
    exports: [AddItemsComponent],
    imports: [
        CommonModule,
        LoadingSpinnerModule,
        MatGridListModule,
        FormsModule,
        MatIconModule,
        MatMenuModule,
        MatButtonModule,
        ConfirmBoxModule,
        EditCatalogItemPopupModule,
        [RouterModule.forChild(routes)]
    ]
})
export class AddItemsModule {}