import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { ConsumerAppointmentComponent } from './consumer-appointment.component';
import { FormMessageDisplayModule } from '../../../../shared/modules/form-message-display/form-message-display.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingSpinnerModule } from '../../../../shared/modules/loading-spinner/loading-spinner.module';
import { CheckinAddMemberModule } from '../../../../shared/modules/checkin-add-member/checkin-add-member.module';
import { CapitalizeFirstPipeModule } from '../../../../shared/pipes/capitalize.module';
import { HeaderModule } from '../../../../shared/modules/header/header.module';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { QuestionnaireModule } from '../../../../shared/components/questionnaire/questionnaire.module';
import { VirtualFieldsModule } from '../../virtualfields/virtualfields.module';
import { ConsumerEmailModule } from '../../../../ynw_consumer/shared/component/consumer-email/consumer-email.module';
import { RouterModule, Routes } from '@angular/router';
import { ServiceDetailModule } from '../../../../shared/components/service-detail/service-detail.module';
import { JcCouponNoteModule } from '../../../../ynw_provider/components/jc-coupon-note/jc-coupon-note.module';
const routes: Routes = [
    { path: '', component: ConsumerAppointmentComponent},
    { path: 'payment/:id',loadChildren: ()=>import('./payment/payment.module').then(m=>m.ConsumerApptPaymentModule) },
    { path: 'track/:id', loadChildren:()=> import('./livetrack/livetrack.module').then(m=>m.ConsumerApptLiveTrackModule) },
    { path: 'history', loadChildren:()=> import('./history/appointment-history.module').then(m=>m.AppointmentHistoryModule) },
    { path: 'bill', loadChildren:()=>import('./appointment-bill/appointment-bill.module').then(m=>m.ConsumerApptBillModule) },
    { path: 'confirm', loadChildren: ()=> import('./confirm-page/confirm-page.module').then(m=>m.ConsumerApptConfirmModule)}
];
@NgModule({
    declarations: [
        ConsumerAppointmentComponent
    ],
    imports: [
        FormMessageDisplayModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CheckinAddMemberModule,
        LoadingSpinnerModule,
        CapitalizeFirstPipeModule,
        HeaderModule,
        NgxIntlTelInputModule,
        QuestionnaireModule,
        VirtualFieldsModule,
        ConsumerEmailModule,
        ServiceDetailModule,
        JcCouponNoteModule,
        [RouterModule.forChild(routes)]
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
    ],
    exports: [ConsumerAppointmentComponent]
})
export class ConsumerAppointmentModule { }
