import { NgModule } from '@angular/core';
import { OwlModule } from 'ngx-owl-carousel';
import { DashboardHomeComponent } from './dashboard-home.component';
import { DashboardHomeRoutingModule } from './dashboard-home.routing.module';
import { BreadCrumbModule } from '../../../../shared/modules/breadcrumb/breadcrumb.module';
import { MaterialModule } from '../../../../shared/modules/common/material.module';
import { CapitalizeFirstPipeModule } from '../../../../shared/pipes/capitalize.module';
import { SharedModule } from '../../../../shared/modules/common/shared.module';
import { PagerModule } from '../../../../shared/modules/pager/pager.module';
import { LoadingSpinnerModule } from '../../../../ynw_provider/components/loading-spinner/loading-spinner.module';

@NgModule({
    imports: [
        DashboardHomeRoutingModule,
        BreadCrumbModule,
        MaterialModule,
        CapitalizeFirstPipeModule,
        SharedModule,
        PagerModule,
        OwlModule,
        LoadingSpinnerModule
    ],
    declarations: [
        DashboardHomeComponent
    ],
    entryComponents: [

    ],
    exports: [DashboardHomeComponent]
})
export class DashboardHomeModule { }
