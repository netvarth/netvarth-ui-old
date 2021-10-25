import { NgModule } from '@angular/core';
import { ConsumerPaymentsComponent } from './payments.component';
import { CommonModule } from '@angular/common';
import { CapitalizeFirstPipeModule } from '../../../shared/pipes/capitalize.module';
import { LoadingSpinnerModule } from '../../../shared/modules/loading-spinner/loading-spinner.module';
import { HeaderModule } from '../../../shared/modules/header/header.module';
import { RouterModule, Routes } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';

const routes: Routes = [
    { path: '', component: ConsumerPaymentsComponent },
    { path: ':id', loadChildren: ()=> import('./payment-details/payment-details.module').then(m=>m.PaymentDetailsModule) }
];

@NgModule({
    declarations: [
        ConsumerPaymentsComponent
    ],
    imports: [
        CommonModule,
        CapitalizeFirstPipeModule,
        LoadingSpinnerModule,
        HeaderModule,
        MatTooltipModule,
        [RouterModule.forChild(routes)]
    ],
    exports: [
        ConsumerPaymentsComponent
    ]
})
export class ConsumerPaymentsModule { }
