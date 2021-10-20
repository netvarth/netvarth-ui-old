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

const routes: Routes = [
    { path: '', component: DonationsComponent },
    { path: '', children: [
            { path: ':id', loadChildren: ()=> import('./details/donation-details.module').then(m=>m.DonationDetailsModule) }
        ]
    }
];

@NgModule({
    declarations: [DonationsComponent],
    imports: [
        CommonModule,
        FormsModule,
        LoadingSpinnerModule,
        PagerModule,
        CapitalizeFirstPipeModule,
        MatTooltipModule,
        MatDatepickerModule,
        MatCheckboxModule,
        [RouterModule.forChild(routes)]
    ],
    exports: [DonationsComponent],
    providers: [CommunicationService]
})
export class DonationsModule {

}
