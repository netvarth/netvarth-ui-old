import { NgModule } from '@angular/core';
import { UsersRoutingModule } from './users.routing.module';
import { BranchUsersComponent } from './users.component';
import { BreadCrumbModule } from '../../../../../shared/modules/breadcrumb/breadcrumb.module';
import { MaterialModule } from '../../../../../shared/modules/common/material.module';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerModule } from '../../../../../shared/modules/loading-spinner/loading-spinner.module';
import { BranchUserDetailComponent } from './details/user-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormMessageDisplayModule } from '../../../../../shared/modules/form-message-display/form-message-display.module';
import { CapitalizeFirstPipeModule } from '../../../../../shared/pipes/capitalize.module';
import { Nl2BrPipeModule } from 'nl2br-pipe';
import { UserDataStorageService } from './settings/user-datastorage.service';
import { PagerModule } from '../../../../../shared/modules/pager/pager.module';
import { OrderModule } from 'ngx-order-pipe';


@NgModule({
    declarations: [
        BranchUsersComponent,
        BranchUserDetailComponent
    ],
    imports: [
        UsersRoutingModule,
        BreadCrumbModule,
        MaterialModule,
        CommonModule,
        FormMessageDisplayModule,
        FormsModule,
        LoadingSpinnerModule,
        ReactiveFormsModule,
        CapitalizeFirstPipeModule,
        Nl2BrPipeModule,
        PagerModule,
        OrderModule

    ],
    providers: [UserDataStorageService],
    exports: [BranchUsersComponent]
})
export class UsersModule {}
