import { NgModule } from '@angular/core';
import { UserNonworkingdayDetailsComponent } from '../user-nonworkingday-details/user-nonworkingday-details.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { LoadingSpinnerModule } from '../../../../../../../../shared/modules/loading-spinner/loading-spinner.module';
import { FormMessageDisplayModule } from '../../../../../../../../shared/modules/form-message-display/form-message-display.module';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
const routes: Routes = [
    { path: '', component: UserNonworkingdayDetailsComponent },
];
@NgModule({
    imports: [
        CommonModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        LoadingSpinnerModule,
        FormMessageDisplayModule,
        NgbTimepickerModule,
        ReactiveFormsModule,
        [RouterModule.forChild(routes)]
    ],
    declarations: [
        UserNonworkingdayDetailsComponent
    ],
    exports: [UserNonworkingdayDetailsComponent]
})

export class UserNonworkingdayDetailsModule { }
