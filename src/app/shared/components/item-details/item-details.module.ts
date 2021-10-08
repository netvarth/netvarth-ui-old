import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { OwlModule } from "ngx-owl-carousel";
import { HeaderModule } from "../../modules/header/header.module";
import { LoadingSpinnerModule } from "../../modules/loading-spinner/loading-spinner.module";
import { ItemDetailsSharedComponent } from "./item-details.component";
const routes: Routes = [
    { path: '', component: ItemDetailsSharedComponent}
]
@NgModule({
    imports: [
        [RouterModule.forChild(routes)],
        CommonModule,
        OwlModule,
        LoadingSpinnerModule,
        HeaderModule
    ],
    exports: [
        ItemDetailsSharedComponent
    ],
    declarations: [
        ItemDetailsSharedComponent
    ]
})
export class ItemDetailsModule {}