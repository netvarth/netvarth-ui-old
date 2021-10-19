import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WaitlistQueuesComponent } from './waitlist-queues.component';
import { LoadingSpinnerModule } from '../../../../../../shared/modules/loading-spinner/loading-spinner.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { CapitalizeFirstPipeModule } from '../../../../../../shared/pipes/capitalize.module';
import { FormMessageDisplayModule } from '../../../../../../shared/modules/form-message-display/form-message-display.module';
import { ReportDataService } from '../../../../reports/reports-data.service';
import { ShowMessagesModule } from '../../../../show-messages/show-messages.module';
import { RouterModule, Routes } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
const routes: Routes = [
    { path: '', component: WaitlistQueuesComponent },
    { path: ':id', loadChildren: ()=> import('../details/waitlist-queuedetail.module').then(m=>m.WaitlistQueueDetailModule) }
];
@NgModule({
    imports: [
        CommonModule,
        LoadingSpinnerModule,
        ReactiveFormsModule,
        NgbTimepickerModule,
        CapitalizeFirstPipeModule,
        FormMessageDisplayModule,
        FormsModule,
        MatTooltipModule,
        MatExpansionModule,
        MatIconModule,
        MatMenuModule,
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule,
        MatSlideToggleModule,
        ShowMessagesModule,
        [RouterModule.forChild(routes)]
    ],
    declarations: [
        WaitlistQueuesComponent
    ],
    exports: [WaitlistQueuesComponent],
    providers: [
        ReportDataService
    ]
})
export class WaitlistQueuesModule { }
