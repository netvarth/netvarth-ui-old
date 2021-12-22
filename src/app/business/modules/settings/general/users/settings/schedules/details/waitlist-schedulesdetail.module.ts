import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterModule, Routes } from '@angular/router';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { CapitalizeFirstPipeModule } from '../../../../../../../../shared/pipes/capitalize.module';
import { FormMessageDisplayModule } from '../../../../../../../../shared/modules/form-message-display/form-message-display.module';
import { WaitlistuserSchedulesDetailComponent } from './waitlist-schedulesdetail.component';
import { LoadingSpinnerModule } from '../../../../../../../../shared/modules/loading-spinner/loading-spinner.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
const routes: Routes = [
    {path: '', component: WaitlistuserSchedulesDetailComponent}
]
@NgModule({
    imports: [
        MatSlideToggleModule,
        MatCheckboxModule,
        NgbTimepickerModule,
        FormMessageDisplayModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatButtonModule,
        LoadingSpinnerModule,
        CapitalizeFirstPipeModule,
        ReactiveFormsModule,
        CommonModule,
        [RouterModule.forChild(routes)]
    ],
    declarations: [
        WaitlistuserSchedulesDetailComponent
    ],
    exports: [WaitlistuserSchedulesDetailComponent]
})
export class WaitlistuserSchedulesDetailModule{ }
