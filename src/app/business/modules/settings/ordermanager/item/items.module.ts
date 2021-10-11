import { NgModule } from '@angular/core';
import { ItemsComponent } from './items.component';
import { CommonModule } from '@angular/common';
import { TruncateModule } from '../../../../../shared/pipes/limitTo.module';
import { CardModule } from '../../../../../shared/components/card/card.module';
import { RouterModule, Routes } from '@angular/router';
import { ConfirmBoxModule } from '../../../../../shared/components/confirm-box/confirm-box.module';
const routes: Routes = [
    { path: '', component: ItemsComponent },
    { path: ':id', loadChildren: ()=> import('./details/item-details.module').then(m=>m.ItemDetailsModule) }
];
@NgModule({
    declarations: [
        ItemsComponent
    ],
    imports: [
        CommonModule,
        CardModule,
        TruncateModule,
        ConfirmBoxModule,
        [RouterModule.forChild(routes)]
    ],
    exports: [ItemsComponent]
})
export class ItemsModule {}
