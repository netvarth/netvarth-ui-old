import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CapitalizeFirstPipeModule } from '../../../shared/pipes/capitalize.module';
import { BreadCrumbModule } from '../../../shared/modules/breadcrumb/breadcrumb.module';
import { MaterialModule } from '../../../shared/modules/common/material.module';
import { FormsModule  } from '@angular/forms';
import { LoadingSpinnerModule } from '../../../shared/modules/loading-spinner/loading-spinner.module';
import { PagerModule } from '../../../shared/modules/pager/pager.module';
import { AddProviderSchedulesModule } from '../add-provider-schedule/add-provider-schedule.module';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { DepartmentModule } from '../../shared/modules/department/department.module';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { JoyrideModule } from 'ngx-joyride';
import { providerSystemauditlogsRoutingModule } from './provider-system-auditlogs.routing.module';
import { ProviderSystemAuditLogComponent } from './provider-system-auditlogs.component';
import { TableModule } from 'primeng/table';
import {MultiSelectModule} from 'primeng/multiselect';
import {InputTextModule} from 'primeng/inputtext';

@NgModule({
    imports: [
        CapitalizeFirstPipeModule,
        providerSystemauditlogsRoutingModule,
        BreadCrumbModule,
        RouterModule,
        CommonModule,
        MaterialModule,
        FormsModule,
        LoadingSpinnerModule,
        PagerModule,
        AddProviderSchedulesModule,
        NgbTimepickerModule,
        DepartmentModule,
        NgxQRCodeModule,
        JoyrideModule.forChild(),
        TableModule,
        MultiSelectModule,
        InputTextModule
    ],
    declarations: [
        ProviderSystemAuditLogComponent
    ],
    entryComponents: [
    ]
})

export class providerSystemauditlogsModule { }

