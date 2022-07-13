import { NgModule } from '@angular/core';
import { DonationsComponent } from './donations.component';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerModule } from '../../../shared/modules/loading-spinner/loading-spinner.module';
import { PagerModule } from '../../../shared/modules/pager/pager.module';
import { CapitalizeFirstPipeModule } from '../../../shared/pipes/capitalize.module';
import { RouterModule, Routes } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { CommunicationService } from '../../services/communication-service';
import { AddInboxMessagesModule } from '../../../shared/components/add-inbox-messages/add-inbox-messages.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { ProviderServices } from '../../services/provider-services.service';
import { MatSelectModule } from "@angular/material/select";

const routes: Routes = [
    { path: '', component: DonationsComponent },
    { path: '', children: [
            { path: ':id', loadChildren: ()=> import('./details/donation-details.module').then(m=>m.DonationDetailsModule) },
            { path: ':id/print', loadChildren: ()=> import('../../shared/print-booking-details/print-booking-detail.module').then(m=>m.PrintBookingDetailModule)} 
        ]
    }
];

@NgModule({
    declarations: [DonationsComponent],
    imports: [
        CommonModule,
        FormsModule,
        MatSelectModule,
        LoadingSpinnerModule,
        PagerModule,
        CapitalizeFirstPipeModule,
        MatTooltipModule,
        MatDatepickerModule,
        MatMenuModule,
        MatIconModule,
        MatCheckboxModule,
        AddInboxMessagesModule,
        [RouterModule.forChild(routes)]
    ],
    exports: [DonationsComponent],
    providers: [CommunicationService,ProviderServices]
})
export class DonationsModule {

}
