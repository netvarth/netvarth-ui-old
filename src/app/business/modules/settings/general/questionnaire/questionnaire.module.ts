import { NgModule } from '@angular/core';
import { QuestionnaireComponent } from './questionnaire.component';
import { QuestionnaireRoutingModule } from './questionnaire.routing.module';
import { QuestionnaireDetailsComponent } from './questionnaire-details/questionnaire-details.component';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { LoadingSpinnerModule } from '../../.../../../../../shared/modules/loading-spinner/loading-spinner.module';
import { QuestionnaireModule } from '../../.../../../../../shared/components/questionnaire/questionnaire.module';

@NgModule({
    imports: [
        QuestionnaireRoutingModule,
        CommonModule,
        MatMenuModule,
        MatIconModule,
        LoadingSpinnerModule,
        QuestionnaireModule
    ],
    declarations: [
        QuestionnaireComponent,
        QuestionnaireDetailsComponent
    ],
    exports: [
        QuestionnaireComponent
    ]
})
export class QuestionnaireListModule { }

