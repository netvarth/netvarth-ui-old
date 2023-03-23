import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CapitalizeFirstPipeModule } from '../../../../../../../../shared/pipes/capitalize.module';
import { ServicesService } from '../../../../../../../../shared/modules/service/services.service';
import { PagerModule } from '../../../../../../../../shared/modules/pager/pager.module';
import { OrderModule } from 'ngx-order-pipe';
import { ShowMessagesModule } from '../../../../../../show-messages/show-messages.module';
import { RouterModule, Routes } from '@angular/router';
import { UserWaitlistServicesComponent } from './user-waitlist-services.component';
import { ServiceqrcodegeneratorModule } from '../../../../../../../../shared/modules/service/serviceqrcodegenerator/serviceqrcodegeneratordetail.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { FormMessageDisplayModule } from '../../../../../../../../shared/modules/form-message-display/form-message-display.module';
import { CommunicationService } from '../../../../../../../../../../src/app/business/services/communication-service';
const routes: Routes = [
    { path: '', component: UserWaitlistServicesComponent },
    { path: ':sid', loadChildren: ()=> import('../details/user-waitlistservice-detail.module').then(m=>m.UserWaitlistserviceDetailModule)}
];
@NgModule({
    imports: [
        MatMenuModule,
        MatIconModule,
        MatTooltipModule,
        MatButtonModule,
        CommonModule,
        CapitalizeFirstPipeModule,
        FormMessageDisplayModule,
        PagerModule,
        OrderModule,
        ServiceqrcodegeneratorModule,
        ShowMessagesModule,
        [RouterModule.forChild(routes)]
    ],
    declarations: [
        UserWaitlistServicesComponent
    ],
    exports: [
        UserWaitlistServicesComponent 
    ],
    providers: [
        ServicesService,
        CommunicationService
    ]
})
export class UserWaitlistServicesModule { }
