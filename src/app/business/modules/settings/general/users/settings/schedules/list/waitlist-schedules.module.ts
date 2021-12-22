import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WaitlistuserSchedulesComponent } from './waitlist-schedules.component';
import { LoadingSpinnerModule } from '../../../../../../../../shared/modules/loading-spinner/loading-spinner.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CapitalizeFirstPipeModule } from '../../../../../../../../shared/pipes/capitalize.module';
import { ShowMessagesModule } from '../../../../../../show-messages/show-messages.module';
import { RouterModule, Routes } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
const routes: Routes = [
    { path: '', component: WaitlistuserSchedulesComponent },
    { path: ':sid', loadChildren: ()=> import('../details/waitlist-schedulesdetail.module').then(m=>m.WaitlistuserSchedulesDetailModule)}
];
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        LoadingSpinnerModule,
        ReactiveFormsModule,
        CapitalizeFirstPipeModule,
        ShowMessagesModule,
        MatTooltipModule,
        MatExpansionModule,
        MatSlideToggleModule,
        MatIconModule,
        MatMenuModule,
        MatButtonModule,
        [RouterModule.forChild(routes)]
    ],
    declarations: [
        WaitlistuserSchedulesComponent
    ],
    exports: [WaitlistuserSchedulesComponent]
})
export class WaitlistuserSchedulesModule {}
