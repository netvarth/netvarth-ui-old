import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { CapitalizeFirstPipeModule } from '../../../../../../../../shared/pipes/capitalize.module';
import { FormMessageDisplayModule } from '../../../../../../../../shared/modules/form-message-display/form-message-display.module';
import { AddServiceComponent } from './addservice.component';
import { CommonModule } from '@angular/common';
@NgModule({
    imports: [
        ReactiveFormsModule,
        MatSlideToggleModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatOptionModule,
        NgbTimepickerModule,
        MatRadioModule,
        MatButtonModule,
        FormMessageDisplayModule,
        CapitalizeFirstPipeModule,
        FormsModule,
        CommonModule
    ],
    declarations: [
        AddServiceComponent
    ],
    exports: [AddServiceComponent]
})
export class AddServiceModule { }
