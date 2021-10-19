import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { WaitlistMgrComponent } from './waitlistmgr.component';
import { SelectionService } from '../../../../shared/services/selectionService';
import { ShowMessagesModule } from '../../show-messages/show-messages.module';
import { ConfirmBoxModule } from '../../../../shared/components/confirm-box/confirm-box.module';
import { RouterModule, Routes } from '@angular/router';
import { MatRadioModule } from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
const routes: Routes = [
    { path: '', component: WaitlistMgrComponent },
    { path: 'services', loadChildren: () => import('./services/list/waitlist-services.module').then(m => m.WaitlistServicesModule) },
    { path: 'queues', loadChildren: () => import('./queues/list/waitlist-queues.module').then(m => m.WaitlistQueuesModule) },
    { path: 'displayboards', loadChildren: () => import('./displayboards/displayboards.module').then(m => m.DisplayboardsModule) }
];
@NgModule({
    imports: [
        CommonModule,
        MatRadioModule,
        MatTooltipModule,
        MatCheckboxModule,
        MatSlideToggleModule,
        FormsModule,
        ShowMessagesModule,
        ConfirmBoxModule,
        [RouterModule.forChild(routes)]
    ],
    declarations: [
        WaitlistMgrComponent
    ],
    exports: [
        WaitlistMgrComponent
    ],
    providers: [
        SelectionService
    ]
})
export class WaitlistMgrModule { }
