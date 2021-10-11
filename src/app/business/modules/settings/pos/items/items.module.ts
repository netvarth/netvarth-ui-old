import { NgModule } from '@angular/core';
import { ItemsComponent } from './items.component';
// import { CommonModule } from '@angular/common';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { MaterialModule } from '../../../../../shared/modules/common/material.module';
// import { GalleryModule } from '../../../../../shared/modules/gallery/gallery.module';
// import { LoadingSpinnerModule } from '../../../../../shared/modules/loading-spinner/loading-spinner.module';
// import { FormMessageDisplayModule } from '../../../../../shared/modules/form-message-display/form-message-display.module';
// import { OrderModule } from 'ngx-order-pipe';
// import { GalleryModule as ModalGalleryModule } from '@ks89/angular-modal-gallery';
// import { CapitalizeFirstPipeModule } from '../../../../../shared/pipes/capitalize.module';
// import { TruncateModule } from '../../../../../shared/pipes/limitTo.module';
// import { CardModule } from '../../../../../shared/components/card/card.module';
import { RouterModule, Routes } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmBoxModule } from '../../../../../shared/components/confirm-box/confirm-box.module';
import { CardModule } from '../../../../../shared/components/card/card.module';
import { CommonModule } from '@angular/common';
const routes: Routes = [
    { path: '', component: ItemsComponent },
    { path: ':id', loadChildren: ()=> import('./details/item-details.module').then(m=>m.ItemDetailsModule) }
];
@NgModule({
    declarations: [
        ItemsComponent    ],
    imports: [
        MatDialogModule,
        ConfirmBoxModule,
        CardModule,
        CommonModule,
        // FormsModule,
        // MaterialModule,
        // GalleryModule,
        // LoadingSpinnerModule,
        // FormMessageDisplayModule,
        // ReactiveFormsModule,
        // OrderModule,
        // ModalGalleryModule.forRoot({ shortcuts: ['ctrl+s', 'meta+s'], disableSsrWorkaround: true }),
        // TruncateModule,
        // CapitalizeFirstPipeModule,
        // CardModule,
        [RouterModule.forChild(routes)]
    ],
    exports: [ItemsComponent]
})
export class ItemsModule {}
