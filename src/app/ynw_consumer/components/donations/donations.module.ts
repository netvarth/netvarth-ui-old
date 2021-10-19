import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CapitalizeFirstPipeModule } from '../../../shared/pipes/capitalize.module';
import { ConsumerDonationsComponent } from './donations.component';
import { HeaderModule } from '../../../shared/modules/header/header.module';
import { RouterModule, Routes } from '@angular/router';
import { ProviderWaitlistCheckInConsumerNoteModule } from '../../../business/modules/check-ins/provider-waitlist-checkin-consumer-note/provider-waitlist-checkin-consumer-note.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
const routes: Routes = [
    { path: '', component: ConsumerDonationsComponent},
    { path: 'confirm', loadChildren: ()=> import('./details/confirm-page/confirm-page.module').then(m=>m.ConfirmPageModule)},
    { path: ':id', loadChildren: ()=>import('./details/consumer-donation.module').then(m=>m.ConsumerDonationModule)},
];
@NgModule({
    declarations: [
        ConsumerDonationsComponent    ],
    imports: [
        CommonModule,
        CapitalizeFirstPipeModule,
        MatDialogModule,
        MatTooltipModule,
        HeaderModule,
        ProviderWaitlistCheckInConsumerNoteModule,
        [RouterModule.forChild(routes)]
    ],
    exports: [ConsumerDonationsComponent]
})
export class ConsumerDonationsModule { }
