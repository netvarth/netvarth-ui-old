import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CapitalizeFirstPipeModule } from '../../../../shared/pipes/capitalize.module';
import { LoadingSpinnerModule } from '../../../../shared/modules/loading-spinner/loading-spinner.module';
import { CustomersListComponent } from './customers-list.component';
import { RouterModule, Routes } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { VoicecallDetailsSendModule } from '../../appointments/voicecall-details-send/voicecall-details-send.module';
import { CustomerActionsModule } from '../customer-actions/customer-actions.module';
import { ConfirmBoxModule } from '../../../../shared/components/confirm-box/confirm-box.module';
import { LastVisitModule } from '../../medicalrecord/last-visit/last-visit.module';
import { FormsModule } from '@angular/forms';
import { PagerModule } from '../../../../shared/modules/pager/pager.module';
import { CommunicationService } from '../../../../business/services/communication-service';

const routes: Routes = [
    { path: '', component: CustomersListComponent},
    { path: ':id/:type/:uid/medicalrecord/:mrId', loadChildren: () => import('../../medicalrecord/medicalrecord.module').then(m => m.MedicalrecordModule) },
    { path: 'find', loadChildren: () => import('../search/customer-search.module').then(m => m.CustomerSearchModule) },
    { path: 'mrlist', loadChildren: () => import('../../medicalrecord/medicalrecord-list/medicalrecord-list.module').then(m => m.MedicalrecordListModule) },
    { path: 'create', loadChildren: () => import('../customer-create/customer-create.module').then(m => m.CustomerCreateModule) },
    { path: ':id', loadChildren: () => import('../customer-details/customer-details.module').then(m => m.CustomerDetailsModule) }
];

@NgModule({
    imports: [
        FormsModule,
        MatDialogModule,
        MatButtonModule,
        MatMenuModule,
        MatIconModule,
        MatTooltipModule,
        MatDatepickerModule,
        MatCheckboxModule,
        CommonModule,
        VoicecallDetailsSendModule,
        CustomerActionsModule,
        ConfirmBoxModule,
        LoadingSpinnerModule,
        CapitalizeFirstPipeModule,
        LastVisitModule,
        PagerModule,
        [RouterModule.forChild(routes)]
    ],
    declarations: [
        CustomersListComponent
    ],
    providers:[
        CommunicationService
    ],
    exports: [CustomersListComponent]
})

export class CustomersListModule { }
