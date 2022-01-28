import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { ConsumerCheckinComponent } from './consumer-checkin.component';
import { CommonModule } from '@angular/common';
import { CapitalizeFirstPipeModule } from '../../../../shared/pipes/capitalize.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RouterModule, Routes } from '@angular/router';
import { ServiceDetailModule } from '../../../../shared/components/service-detail/service-detail.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingSpinnerModule } from '../../../../shared/modules/loading-spinner/loading-spinner.module';
import { JcCouponNoteModule } from '../../../../shared/modules/jc-coupon-note/jc-coupon-note.module';
import { MatChipsModule } from '@angular/material/chips';
import { QuestionnaireModule } from '../../../../shared/components/questionnaire/questionnaire.module';
import { MatRadioModule } from '@angular/material/radio';
import { CheckinAddMemberModule } from '../../../../shared/modules/checkin-add-member/checkin-add-member.module';
import { DatePaginationComponent } from './date-pagination/date-pagination.component';
const routes: Routes = [
    { path: '', component: ConsumerCheckinComponent},
    // { path: 'payment/:id', loadChildren: ()=> import('./payment/payment.module').then(m=>m.ConsumerCheckinPaymentModule) },
    { path: 'track/:id', loadChildren: ()=> import('./livetrack/livetrack.module').then(m=>m.ConsumerLiveTrackModule) },
    { path: 'bill', loadChildren: ()=> import('./checkin-bill/checkin-bill.module').then(m=>m.ConsumerCheckinBillModule) },
    { path: 'confirm', loadChildren: ()=> import('./confirm-page/confirm-page.module').then(m=>m.ConsumerCheckinConfirmModule)}
];
@NgModule({
    declarations: [
        ConsumerCheckinComponent,
        DatePaginationComponent
    ],
    imports: [
        CommonModule,
        CapitalizeFirstPipeModule,
        MatFormFieldModule,
        MatDatepickerModule,
        MatTooltipModule,
        MatCheckboxModule,
        MatRadioModule,
        ServiceDetailModule,
        JcCouponNoteModule,
        CheckinAddMemberModule ,
        MatFormFieldModule,
        MatChipsModule,
        FormsModule,
        QuestionnaireModule,
        ReactiveFormsModule,
        LoadingSpinnerModule,
        [RouterModule.forChild(routes)]
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
    ],
    exports: [ConsumerCheckinComponent]
})
export class ConsumerCheckinModule { }
