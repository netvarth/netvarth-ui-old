import { NgModule } from '@angular/core';
import { AppointmentsComponent } from './appointments.component';
import { AppointmentsRoutingModule } from './appointments.routing.module';
import { BreadCrumbModule } from '../../../shared/modules/breadcrumb/breadcrumb.module';
import { MaterialModule } from '../../../shared/modules/common/material.module';
import { CapitalizeFirstPipeModule } from '../../../shared/pipes/capitalize.module';
import { SharedModule } from '../../../shared/modules/common/shared.module';
import { PagerModule } from '../../../shared/modules/pager/pager.module';
import { OwlModule } from 'ngx-owl-carousel';
import { LoadingSpinnerModule } from '../../../ynw_provider/components/loading-spinner/loading-spinner.module';

@NgModule({
    imports: [
        AppointmentsRoutingModule,
        BreadCrumbModule,
        MaterialModule,
        CapitalizeFirstPipeModule,
        SharedModule,
        PagerModule,
        OwlModule,
        LoadingSpinnerModule
    ],
    declarations: [
        AppointmentsComponent
    ],
    entryComponents: [

    ],
    exports: [AppointmentsComponent]
})
export class AppointmentsModule { }
