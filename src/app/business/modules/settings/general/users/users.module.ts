import { NgModule } from '@angular/core';
import { BranchUsersComponent } from './users.component';
import { LoadingSpinnerModule } from '../../../../../shared/modules/loading-spinner/loading-spinner.module';
import { CapitalizeFirstPipeModule } from '../../../../../shared/pipes/capitalize.module';
import { UserDataStorageService } from './settings/user-datastorage.service';
import { ShowMessagesModule } from '../../../show-messages/show-messages.module';
import { UserContactInfoModule } from './user-contact-info/user-contact-info.module';
import { RouterModule, Routes } from '@angular/router';
import { ConfirmBoxModule } from '../../../../../shared/components/confirm-box/confirm-box.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import {  MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { OrderModule } from 'ngx-order-pipe';
const routes: Routes = [
    { path: '', component: BranchUsersComponent },
    { path: ':id', loadChildren: ()=> import('./details/user-detail.module').then(m=>m.BranchUserDetailModule)},
    { path: ':id/settings', loadChildren: () => import('./settings/manage-settings.module').then(m => m.ManageSettingsModule)}
];
@NgModule({
    declarations: [
        BranchUsersComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        MatTooltipModule,
        MatCheckboxModule,
        MatButtonModule,
        MatMenuModule,
        MatIconModule,
        MatSelectModule,
        MatOptionModule,
        ConfirmBoxModule,
        ShowMessagesModule,
        UserContactInfoModule,
        CapitalizeFirstPipeModule,
        LoadingSpinnerModule,
        OrderModule,
        [RouterModule.forChild(routes)]

    ],
    providers: [UserDataStorageService],
    exports: [BranchUsersComponent]
})
export class UsersModule {}
