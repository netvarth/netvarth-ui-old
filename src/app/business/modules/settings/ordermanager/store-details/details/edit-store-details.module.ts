import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { RouterModule, Routes } from "@angular/router";
import { LoadingSpinnerModule } from "../../../../../../shared/modules/loading-spinner/loading-spinner.module";
import { EditStoreDetailsComponent } from "./edit-store-details.component";
const routes: Routes = [
    {path: '', component: EditStoreDetailsComponent}
]
@NgModule({
    declarations: [EditStoreDetailsComponent],
    exports: [EditStoreDetailsComponent],
    imports: [
        CommonModule,
        FormsModule,
        MatButtonModule,
        [RouterModule.forChild(routes)],
        LoadingSpinnerModule
    ]
})
export class EditStoreDetailsModule{}