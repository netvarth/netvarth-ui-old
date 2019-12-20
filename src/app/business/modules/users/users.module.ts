import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadCrumbModule } from '../../../shared/modules/breadcrumb/breadcrumb.module';

import { AddProviderNonworkingdaysComponent } from '../../../ynw_provider/components/add-provider-nonworkingdays/add-provider-nonworkingdays.component';
import { ProviderNonworkingdaysComponent } from '../../../ynw_provider/components/provider-nonworkingdays/provider-nonworkingdays.component';
import { MaterialModule } from '../../../shared/modules/common/material.module';
import { FormsModule } from '@angular/forms';
import { LoadingSpinnerModule } from '../../../ynw_provider/components/loading-spinner/loading-spinner.module';
import { FormMessageDisplayModule } from '../../../shared/modules/form-message-display/form-message-display.module';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../../shared/modules/common/shared.module';
import { UsersRoutingModule } from './users.routing.module';
import { UsersComponent } from './users.component';

@NgModule({
    imports: [
        CommonModule,
        BreadCrumbModule,
        UsersRoutingModule,
        MaterialModule,
        FormsModule,
        LoadingSpinnerModule,
        FormMessageDisplayModule,
        NgbTimepickerModule,
        SharedModule
    ],
    declarations: [
        UsersComponent,
       
    ],
    entryComponents: [
       
    ],
    exports: [UsersComponent]
})
export class UsersModule { }
