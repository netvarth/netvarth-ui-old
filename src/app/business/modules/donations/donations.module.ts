import { NgModule } from '@angular/core';
import { DonationsRoutingModule } from './donations.routing.module';
import { DonationsComponent } from './donations.component';
import { DonationDetailsComponent } from './details/donation-details.component';
import { BreadCrumbModule } from '../../../shared/modules/breadcrumb/breadcrumb.module';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/modules/common/material.module';
import { LoadingSpinnerModule } from '../../../shared/modules/loading-spinner/loading-spinner.module';
import { PagerModule } from '../../../shared/modules/pager/pager.module';
import { SharedModule } from '../../../shared/modules/common/shared.module';
import { CapitalizeFirstPipeModule } from '../../../shared/pipes/capitalize.module';
import { Nl2BrPipeModule } from 'nl2br-pipe';
import { RecordsDatagridModule } from '../bookings/records-datagrid/records-datagrid.module';
import { InboxListModule } from '../inbox-list/inbox-list.module';
import { CustomerBookingDetailsModule } from '../bookings/customer-booking-details/customer-booking-details.module';
import { BookingDocumentsModule } from '../bookings/booking-documents/booking-documents.module';
import { QuestionnaireListPopupModule } from '../questionnaire-list-popup/questionnaire-list-popup.module';


@NgModule({
    declarations: [DonationsComponent,
        DonationDetailsComponent],
    imports: [
        DonationsRoutingModule,
        BreadCrumbModule,
        CommonModule,
        MaterialModule,
        LoadingSpinnerModule,
        PagerModule,
        SharedModule,
        CapitalizeFirstPipeModule,
        Nl2BrPipeModule,
        QuestionnaireListPopupModule,
        RecordsDatagridModule,
        InboxListModule,
        CustomerBookingDetailsModule,
        BookingDocumentsModule
    ],
    exports: [DonationsComponent]
})
export class DonationsModule {

}
