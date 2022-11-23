import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ConsumerJoinModule } from '../../../ynw_consumer/components/consumer-join/join.component.module';
import { AuthenticationModule } from '../../modules/authentication/authentication.module';
import { LoadingSpinnerModule } from '../../modules/loading-spinner/loading-spinner.module';
import { CapitalizeFirstPipeModule } from '../../pipes/capitalize.module';
import { QuestionnaireModule } from '../questionnaire/questionnaire.module';
import { QuestionnaireLinkComponent } from './questionnaire-link.component';
import { QuestionnaireLinkRoutingModule } from './questionnaire-link.routing.module';

@NgModule({
    declarations: [
        QuestionnaireLinkComponent
    ],
    imports: [
        CommonModule,
        QuestionnaireLinkRoutingModule,
        LoadingSpinnerModule,
        QuestionnaireModule,
        CapitalizeFirstPipeModule,
        ConsumerJoinModule,
        AuthenticationModule
    ],
    exports: [QuestionnaireLinkComponent]
})
export class QuestionnaireLinkModule { }
