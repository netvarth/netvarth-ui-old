import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { LoadingSpinnerModule } from '../../../../../../../../shared/modules/loading-spinner/loading-spinner.module';
import { UserWaitlistQueueDetailComponent } from './user-waitlist-queuedetail.component';
const routes: Routes= [
    {path: '', component: UserWaitlistQueueDetailComponent}
]
@NgModule({
    imports: [
        CommonModule,
        LoadingSpinnerModule,
        FormMessageDisplayModule,
        FormsModule,
        ReactiveFormsModule,
        NgbTimepickerModule,
        MatSlideToggleModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatButtonModule,
        CapitalizeFirstPipeModule,
        [RouterModule.forChild(routes)]
    ],
    declarations: [
        UserWaitlistQueueDetailComponent
    ],
    exports: [UserWaitlistQueueDetailComponent]
})
export class UserWaitlistQueueDetailModule { }
