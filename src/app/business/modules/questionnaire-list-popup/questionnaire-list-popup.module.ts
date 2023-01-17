import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { QuestionaireViewModule } from '../../../shared/components/questionaire-view/questionaire-view.module';
import { QuestionnaireModule } from '../../../shared/components/questionnaire/questionnaire.module';
import { LoadingSpinnerModule } from '../../../shared/modules/loading-spinner/loading-spinner.module';
import { QuestionnaireListPopupComponent } from './questionnaire-list-popup.component';
import { QuestionnaireListPopupRoutingModule } from './questionnaire-list-popup.routing.module';
import { ReleaseQuestionnaireModule } from './release-questionnaire/release-questionnaire.module';

@NgModule({
    declarations: [
        QuestionnaireListPopupComponent
    ],
    imports: [
        CommonModule,
        QuestionnaireListPopupRoutingModule,
        LoadingSpinnerModule,
        QuestionnaireModule,
        QuestionaireViewModule,
        ReleaseQuestionnaireModule
    ],
    exports: [QuestionnaireListPopupComponent]
})

export class QuestionnaireListPopupModule {

}
