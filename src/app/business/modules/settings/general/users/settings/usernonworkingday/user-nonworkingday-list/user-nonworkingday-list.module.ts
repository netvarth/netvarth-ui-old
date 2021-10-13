import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule, Routes } from '@angular/router';
import { ConfirmBoxModule } from '../../../../../../../../shared/components/confirm-box/confirm-box.module';
import { UserNonworkingdayListComponent } from './user-nonworkingday-list.component';
const routes: Routes = [
    { path: '', component: UserNonworkingdayListComponent },
    { path: ':sid', loadChildren: ()=> import('../user-nonworkingday-details/user-nonworkingday-details.module').then(m=>m.UserNonworkingdayDetailsModule)},
];
@NgModule({
    imports: [
        CommonModule,
        MatDialogModule,
        MatMenuModule,
        MatIconModule,
        MatButtonModule,
        ConfirmBoxModule,
        [RouterModule.forChild(routes)]
    ],
    declarations: [
        UserNonworkingdayListComponent
    ],
    exports: [UserNonworkingdayListComponent]
})

export class UserNonworkingdayListModule { }
