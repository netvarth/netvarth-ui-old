import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { HeaderModule } from "../../../../shared/modules/header/header.module";
import { ItemDetailsComponent } from "./item-details.component";
import { GalleryModule as ModalGalleryModule } from '@ks89/angular-modal-gallery';
import { RouterModule, Routes } from "@angular/router";
const routes: Routes= [
    {path: '', component: ItemDetailsComponent}
]
@NgModule({
    declarations: [ItemDetailsComponent],
    exports: [ItemDetailsComponent],
    imports: [
        CommonModule,
        HeaderModule,
        ModalGalleryModule.forRoot({ shortcuts: ['ctrl+s', 'meta+s'], disableSsrWorkaround: true }),
        [RouterModule.forChild(routes)]
    ]
})
export class ItemDetailsModule{}