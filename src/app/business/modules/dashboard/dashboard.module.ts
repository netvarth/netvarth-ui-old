import { NgModule } from '@angular/core';
import { OwlModule } from 'ngx-owl-carousel';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard.routing.module';
import { BreadCrumbModule } from '../../../shared/modules/breadcrumb/breadcrumb.module';
import { MaterialModule } from '../../../shared/modules/common/material.module';
import { CapitalizeFirstPipeModule } from '../../../shared/pipes/capitalize.module';
import { SharedModule } from '../../../shared/modules/common/shared.module';
import { PagerModule } from '../../../shared/modules/pager/pager.module';
import { LoadingSpinnerModule } from '../../../ynw_provider/components/loading-spinner/loading-spinner.module';

@NgModule({
    imports: [
        DashboardRoutingModule,
        BreadCrumbModule,
        MaterialModule,
        CapitalizeFirstPipeModule,
        SharedModule,
        PagerModule,
        OwlModule,
        LoadingSpinnerModule
    ],
    declarations: [
        DashboardComponent
    ],
    entryComponents: [

    ],
    exports: [DashboardComponent]
})
export class DashboardModule { }
