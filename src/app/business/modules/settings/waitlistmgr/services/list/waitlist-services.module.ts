import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { WaitlistServicesComponent } from './waitlist-services.component';
import { CommonModule } from '@angular/common';
import { CapitalizeFirstPipeModule } from '../../../../../../shared/pipes/capitalize.module';
import { FormMessageDisplayModule } from '../../../../../../shared/modules/form-message-display/form-message-display.module';
import { ServicesService } from '../../../../../../shared/modules/service/services.service';
import { PagerModule } from '../../../../../../shared/modules/pager/pager.module';
import { OrderModule } from 'ngx-order-pipe';
import { ShowMessagesModule } from '../../../../show-messages/show-messages.module';
import { RouterModule, Routes } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { ServiceqrcodegeneratorModule } from '../../../../../../shared/modules/service/serviceqrcodegenerator/serviceqrcodegeneratordetail.module';
import { CommunicationService } from '../../../../../../../../src/app/business/services/communication-service';
const routes: Routes = [
    { path: '', component: WaitlistServicesComponent },
    { path: ':id', loadChildren: ()=> import('../details/waitlistservice-detail.module').then(m=>m.WaitlistServiceDetailModule)}
];
@NgModule({
    imports: [
        CommonModule,
        MatIconModule,
        MatMenuModule,
        MatButtonModule,
        CapitalizeFirstPipeModule,
        FormMessageDisplayModule,
        PagerModule,
        OrderModule,
        ShowMessagesModule,
        ServiceqrcodegeneratorModule,
        [RouterModule.forChild(routes)]
    ],
    declarations: [
        WaitlistServicesComponent
    ],
    exports: [
        WaitlistServicesComponent
    ],
    providers: [
        ServicesService,
        CommunicationService
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
    ]
})
export class WaitlistServicesModule { }
