import { NgModule } from '@angular/core';
import { CustomViewListComponent } from './custom-view-list.component';
import { RouterModule, Routes } from '@angular/router';
import { ConfirmBoxModule } from '../../../../../../shared/components/confirm-box/confirm-box.module';
import { LoadingSpinnerModule } from '../../../../../../shared/modules/loading-spinner/loading-spinner.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

const routes: Routes = [
    { path: '', component: CustomViewListComponent},
    { path: ':id', loadChildren: ()=> import('../customview-create/customview.module').then(m=>m.CustomviewModule)},
];

@NgModule({
    imports: [
        CommonModule,
        MatMenuModule,
        MatIconModule,
        MatButtonModule,
        MatTooltipModule,
        MatDialogModule,
        LoadingSpinnerModule,
        ConfirmBoxModule,
        [RouterModule.forChild(routes)]
    ],
    declarations: [
        CustomViewListComponent
    ],
    exports: [CustomViewListComponent]
})

export class CustomViewListModule { }
