import { NgModule } from '@angular/core';
import { UsersRoutingModule } from './users.routing.module';
import { BranchUsersComponent } from './users.component';
import { BreadCrumbModule } from '../../../../shared/modules/breadcrumb/breadcrumb.module';
import { MaterialModule } from '../../../../shared/modules/common/material.module';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerModule } from '../../../../ynw_provider/components/loading-spinner/loading-spinner.module';
import { BranchUserDetailComponent } from './details/user-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormMessageDisplayModule } from '../../../../shared/modules/form-message-display/form-message-display.module';
import { AdditionalInfoComponent } from './additionalinfo/additionalinfo.component';
import { CapitalizeFirstPipeModule } from '../../../../shared/pipes/capitalize.module';
import { Nl2BrPipeModule } from 'nl2br-pipe';

@NgModule({
    declarations: [
        BranchUsersComponent,
        BranchUserDetailComponent,
        AdditionalInfoComponent
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

    ],
    entryComponents: [],
    exports: [BranchUsersComponent]
})
export class UsersModule {}
