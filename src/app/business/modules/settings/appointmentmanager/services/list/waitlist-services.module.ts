import { NgModule } from '@angular/core';
import { WaitlistServicesComponent } from './waitlist-services.component';
import { CommonModule } from '@angular/common';
import { CapitalizeFirstPipeModule } from '../../../../../../shared/pipes/capitalize.module';
import { FormMessageDisplayModule } from '../../../../../../shared/modules/form-message-display/form-message-display.module';
import { ServicesService } from '../../../../../../shared/modules/service/services.service';
import { PagerModule } from '../../../../../../shared/modules/pager/pager.module';
import { OrderModule } from 'ngx-order-pipe';
import { ShowMessagesModule } from '../../../../show-messages/show-messages.module';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ServiceqrcodegeneratorModule } from '../../../../../../shared/modules/service/serviceqrcodegenerator/serviceqrcodegeneratordetail.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { LoadingSpinnerModule } from '../../../../../../../../src/app/shared/modules/loading-spinner/loading-spinner.module';
import { MatCardModule } from '@angular/material/card';
import { CommunicationService } from '../../../../../../../../src/app/business/services/communication-service';
const routes: Routes = [
    { path: '', component: WaitlistServicesComponent },
    { path: ':id', loadChildren: ()=> import('../details/waitlistservice-detail.module').then(m=>m.WaitlistserviceDetailModule)}
];
@NgModule({
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        MatMenuModule,
        MatIconModule,
        MatTooltipModule,
        CapitalizeFirstPipeModule,
        FormMessageDisplayModule,
        PagerModule,
        OrderModule,
        MatCheckboxModule,
        ShowMessagesModule,
        LoadingSpinnerModule,
        MatCardModule,
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
    ]
})
export class WaitlistServicesModule { }
