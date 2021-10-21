import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WaitlistSchedulesComponent } from './waitlist-schedules.component';
import { LoadingSpinnerModule } from '../../../../../../shared/modules/loading-spinner/loading-spinner.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CapitalizeFirstPipeModule } from '../../../../../../shared/pipes/capitalize.module';
import { FormMessageDisplayModule } from '../../../../../../shared/modules/form-message-display/form-message-display.module';
import { ShowMessagesModule } from '../../../../show-messages/show-messages.module';
import { RouterModule, Routes } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
const routes: Routes = [
    { path: '', component: WaitlistSchedulesComponent },
    { path: ':sid', loadChildren: ()=>import('../details/waitlist-schedulesdetail.module').then(m=>m.WaitlistSchedulesdetailModule)}
];
@NgModule({
    imports: [
        CommonModule,
        LoadingSpinnerModule,
        FormsModule,
        ReactiveFormsModule,
        CapitalizeFirstPipeModule,
        FormMessageDisplayModule,
        ShowMessagesModule,
        MatExpansionModule,
        MatTooltipModule,
        MatSlideToggleModule,
        MatMenuModule,
        MatIconModule,
        MatButtonModule,
        [RouterModule.forChild(routes)]
    ],
    declarations: [
        WaitlistSchedulesComponent
    ],
    exports: [WaitlistSchedulesComponent]
})
export class WaitlistSchedulesModule {}
