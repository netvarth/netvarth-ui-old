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
        ShowMessagesModule,
        [RouterModule.forChild(routes)]
    ],
    declarations: [
        WaitlistServicesComponent
    ],
    exports: [
        WaitlistServicesComponent
    ],
    providers: [
        ServicesService
    ]
})
export class WaitlistServicesModule { }
