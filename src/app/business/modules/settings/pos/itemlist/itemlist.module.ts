import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmBoxModule } from '../../../../../shared/components/confirm-box/confirm-box.module';
import { CardModule } from '../../../../../shared/components/card/card.module';
import { CommonModule } from '@angular/common';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {RatingModule} from 'primeng/rating';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { ItemlistComponent } from './itemlist.component';
const routes: Routes = [
    { path: '', component: ItemlistComponent },
    // { path: ':id', loadChildren: ()=> import('./details/item-details.module').then(m=>m.ItemDetailsModule) },
    // { path: 'group', loadChildren: ()=> import('./itemgroup/itemgroup.module').then(m=>m.ItemgroupModule)}

];
@NgModule({
    declarations: [
      ItemlistComponent    ],
    imports: [
        MatDialogModule,
        ConfirmBoxModule,
        FormsModule,
        ReactiveFormsModule,
        CardModule,
        CommonModule,
        TableModule,
        ButtonModule,
        MatMenuModule,
        MatIconModule,
        RatingModule,
        [RouterModule.forChild(routes)]
    ],
    exports: [ItemlistComponent]
})
export class ItemlistModule {}

