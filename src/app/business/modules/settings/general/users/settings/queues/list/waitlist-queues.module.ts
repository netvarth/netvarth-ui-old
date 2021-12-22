import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WaitlistQueuesComponent } from './waitlist-queues.component';
import { LoadingSpinnerModule } from '../../../../../../../../shared/modules/loading-spinner/loading-spinner.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { CapitalizeFirstPipeModule } from '../../../../../../../../shared/pipes/capitalize.module';
import { FormMessageDisplayModule } from '../../../../../../../../shared/modules/form-message-display/form-message-display.module';
import { ShowMessagesModule } from '../../../../../../show-messages/show-messages.module';
import { RouterModule, Routes } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
const routes: Routes = [
    { path: '', component: WaitlistQueuesComponent },
    { path: ':sid', loadChildren: ()=>import('../details/user-waitlist-queuedetail.module').then(m=>m.UserWaitlistQueueDetailModule)}
];
@NgModule({
    imports: [
        CommonModule,
        MatTooltipModule,
        MatExpansionModule,
        MatIconModule,
        MatButtonModule,
        MatMenuModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule,
        MatSlideToggleModule,
        LoadingSpinnerModule,
        ReactiveFormsModule,
        NgbTimepickerModule,
        CapitalizeFirstPipeModule,
        FormMessageDisplayModule,
        ShowMessagesModule,
        [RouterModule.forChild(routes)]
    ],
    declarations: [
        WaitlistQueuesComponent
    ],
    exports: [WaitlistQueuesComponent]
})
export class WaitlistQueuesModule { }
