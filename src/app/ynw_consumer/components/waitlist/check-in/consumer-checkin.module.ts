import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { ConsumerCheckinComponent } from './consumer-checkin.component';
import { CommonModule } from '@angular/common';
import { CapitalizeFirstPipeModule } from '../../../../shared/pipes/capitalize.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RouterModule, Routes } from '@angular/router';
import { ServiceDetailModule } from '../../../../shared/components/service-detail/service-detail.module';
import { JcCouponNoteModule } from '../../../../ynw_provider/components/jc-coupon-note/jc-coupon-note.module';
const routes: Routes = [
    { path: '', component: ConsumerCheckinComponent},
    { path: 'payment/:id', loadChildren: ()=> import('./payment/payment.module').then(m=>m.ConsumerCheckinPaymentModule) },
    { path: 'track/:id', loadChildren: ()=> import('./livetrack/livetrack.module').then(m=>m.ConsumerLiveTrackModule) },
    { path: 'bill', loadChildren: ()=> import('./checkin-bill/checkin-bill.module').then(m=>m.ConsumerCheckinBillModule) },
    { path: 'confirm', loadChildren: ()=> import('./confirm-page/confirm-page.module').then(m=>m.ConsumerCheckinConfirmModule)}
];
@NgModule({
    declarations: [
        ConsumerCheckinComponent
    ],
    imports: [
        CommonModule,
        CapitalizeFirstPipeModule,
        MatFormFieldModule,
        MatChipsModule,
        MatDatepickerModule,
        MatTooltipModule,
        MatCheckboxModule,
        ServiceDetailModule,
        JcCouponNoteModule,
        [RouterModule.forChild(routes)]
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
    ],
    exports: [ConsumerCheckinComponent]
})
export class ConsumerCheckinModule { }
