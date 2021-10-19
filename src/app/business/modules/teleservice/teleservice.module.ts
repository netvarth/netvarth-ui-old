import { NgModule } from '@angular/core';
import { TeleServiceComponent } from './teleservice.component';
import { CapitalizeFirstPipeModule } from '../../../shared/pipes/capitalize.module';
import { LoadingSpinnerModule } from '../../../shared/modules/loading-spinner/loading-spinner.module';
import { RouterModule, Routes } from '@angular/router';
import { TeleServiceConfirmBoxModule } from './teleservice-confirm-box/teleservice-confirm-box.module';
import { CheckinsActionsModule } from '../check-ins/checkin-actions/checkin-actions.module';
import { AppointmentActionsModule } from '../appointments/appointment-actions/appointment-actions.module';
import { CommonModule } from '@angular/common';
import { TeleServiceShareModule } from './teleservice-share/teleservice-share.module';
const routes: Routes = [
    { path: '', component: TeleServiceComponent}
];
@NgModule({
    imports: [
        CommonModule,
        CapitalizeFirstPipeModule,
        LoadingSpinnerModule,
        TeleServiceConfirmBoxModule,
        TeleServiceShareModule,
        CheckinsActionsModule,
        AppointmentActionsModule,
        [RouterModule.forChild(routes)]
    ],
    declarations: [
        TeleServiceComponent
    ],
    exports: [TeleServiceComponent]
})
export class TeleServiceModule { }
