import { NgModule } from '@angular/core';
import { ServiceComponent } from './service.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormMessageDisplayModule } from '../form-message-display/form-message-display.module';
import { CapitalizeFirstPipeModule } from '../../pipes/capitalize.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { UserlistpopupModule } from './userlist/userlistpopup.module';
import { ServiceqrcodegeneratorModule } from './serviceqrcodegenerator/serviceqrcodegeneratordetail.module';
import { MatRadioModule } from '@angular/material/radio';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        FormMessageDisplayModule,
        CommonModule,
        CapitalizeFirstPipeModule,
        MatTooltipModule,
        MatSlideToggleModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatRadioModule,
        MatOptionModule,
        MatCheckboxModule,
        MatButtonModule,
        NgbTimepickerModule,
        UserlistpopupModule,
        ServiceqrcodegeneratorModule

    ],
    declarations: [
        ServiceComponent
    ],
    exports: [ServiceComponent]
})

export class ServiceModule { }
