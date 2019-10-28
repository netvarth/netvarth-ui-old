import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadCrumbModule } from '../../../shared/modules/breadcrumb/breadcrumb.module';
import { MiscellaneousComponent } from './miscellaneous.component';
import { MiscellaneousRoutingModule } from './miscellaneous.routing.module';
import { AddProviderNonworkingdaysComponent } from '../../../ynw_provider/components/add-provider-nonworkingdays/add-provider-nonworkingdays.component';
import { ProviderNonworkingdaysComponent } from '../../../ynw_provider/components/provider-nonworkingdays/provider-nonworkingdays.component';
import { MaterialModule } from '../../../shared/modules/common/material.module';
import { FormsModule } from '@angular/forms';
import { LoadingSpinnerModule } from '../../../ynw_provider/components/loading-spinner/loading-spinner.module';
import { FormMessageDisplayModule } from '../../../shared/modules/form-message-display/form-message-display.module';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../../shared/modules/common/shared.module';
import { ProviderNotificationsComponent } from '../../../ynw_provider/components/provider-notifications/provider-notifications.component';
import { SaleschannelComponent } from './saleschannel/saleschannel.component';
import { JDNComponent } from './jdn/jdn.component';
@NgModule({
    imports: [
        CommonModule,
        BreadCrumbModule,
        MiscellaneousRoutingModule,
        MaterialModule,
        FormsModule,
        LoadingSpinnerModule,
        FormMessageDisplayModule,
        NgbTimepickerModule,
        SharedModule
    ],
    declarations: [
        MiscellaneousComponent,
        AddProviderNonworkingdaysComponent,
        ProviderNonworkingdaysComponent,
        ProviderNotificationsComponent,
        SaleschannelComponent,
        JDNComponent
    ],
    entryComponents: [
        AddProviderNonworkingdaysComponent
    ],
    exports: [MiscellaneousComponent]
})
export class MiscellaneousModule { }
