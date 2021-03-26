import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { LoadingSpinnerModule } from '../../../ynw_provider/components/loading-spinner/loading-spinner.module';
import { HeaderModule } from '../../modules/header/header.module';
import { QuestionnaireComponent } from './questionnaire.component';
import { QuestionnaireRoutingModule } from './questionnaire.routing.module';

@NgModule({
    declarations: [
        QuestionnaireComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        MatDatepickerModule,
        MatCheckboxModule,
        MatSlideToggleModule,
        QuestionnaireRoutingModule,
        HeaderModule,
        LoadingSpinnerModule
    ],
    exports: [QuestionnaireComponent]
})
export class QuestionnaireModule { }
