import { NgModule } from '@angular/core';
import { ItemsComponent } from './items.component';
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
        [RouterModule.forChild(routes)]
    ],
    exports: [ItemsComponent]
})
export class ItemsModule {}
