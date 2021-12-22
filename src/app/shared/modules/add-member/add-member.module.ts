import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormMessageDisplayModule } from '../../../shared/modules/form-message-display/form-message-display.module';

import { AddMemberComponent } from './add-member.component';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        FormMessageDisplayModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatRadioModule,
        MatDatepickerModule
    ],
    entryComponents: [
        AddMemberComponent
    ],
    declarations: [
        AddMemberComponent
    ],
    exports: [AddMemberComponent]
})
export class AddMemberModule {
}
