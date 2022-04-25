import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CapitalizeFirstPipeModule } from '../../../shared/pipes/capitalize.module';
import { ConsumerDonationsComponent } from './donations.component';
import { HeaderModule } from '../../../shared/modules/header/header.module';
import { RouterModule, Routes } from '@angular/router';
import { ProviderWaitlistCheckInConsumerNoteModule } from '../../../business/modules/check-ins/provider-waitlist-checkin-consumer-note/provider-waitlist-checkin-consumer-note.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { GalleryModule as ModalGalleryModule } from '@ks89/angular-modal-gallery';
// import { GalleryModule } from '../../../shared/modules/gallery/gallery.module';
// import {  CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
// import { GalleryModule as ModalGalleryModule } from '@ks89/angular-modal-gallery';

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
        // GalleryModule,
        ModalGalleryModule.forRoot({ shortcuts: ['ctrl+s', 'meta+s'], disableSsrWorkaround: true }),
        [RouterModule.forChild(routes)]
    ],
    exports: [ConsumerDonationsComponent],
    // schemas: [
    //     CUSTOM_ELEMENTS_SCHEMA,
    //     NO_ERRORS_SCHEMA
    //   ],
})
export class ConsumerDonationsModule { }
