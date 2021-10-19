import { NgModule } from '@angular/core';
import { DiscountComponent } from './discount.component';
import { ConfirmBoxModule } from '../../../../../shared/components/confirm-box/confirm-box.module';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
const routes: Routes = [
    { path: '', component: DiscountComponent },
    { path: ':id', loadChildren: ()=> import('./details/discountdetails.module').then(m=>m.DiscountDetailsModule)}
];
@NgModule({
    declarations: [
        DiscountComponent
    ],
    imports: [
        CommonModule,
        MatDialogModule,
        ConfirmBoxModule,
        MatMenuModule,
        MatIconModule,
        MatButtonModule,
        [RouterModule.forChild(routes)]
    ],
    exports: [DiscountComponent]
})
export class DiscountModule { }
