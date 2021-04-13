import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadCrumbModule } from '../../../../shared/modules/breadcrumb/breadcrumb.module';
import { MiscellaneousComponent } from './miscellaneous.component';
import { MiscellaneousRoutingModule } from './miscellaneous.routing.module';
import { MaterialModule } from '../../../../shared/modules/common/material.module';
import { FormsModule } from '@angular/forms';
import { LoadingSpinnerModule } from '../../../../shared/modules/loading-spinner/loading-spinner.module';
import { FormMessageDisplayModule } from '../../../../shared/modules/form-message-display/form-message-display.module';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../../../shared/modules/common/shared.module';
import { JDNComponent } from './jdn/jdn.component';
import { SalesChannelModule } from '../../../../shared/modules/saleschannel/saleschannel.module';
import { SaleschannelSettingsComponent } from './saleschannel/sc-settings.component';
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
        SharedModule,
        SalesChannelModule
    ],
    declarations: [
        MiscellaneousComponent,
        SaleschannelSettingsComponent,
        JDNComponent
    ],
    exports: [MiscellaneousComponent]
})
export class MiscellaneousModule { }
