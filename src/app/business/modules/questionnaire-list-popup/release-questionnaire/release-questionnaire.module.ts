import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormMessageDisplayModule } from '../../../../shared/modules/form-message-display/form-message-display.module';
import { ReleaseQuestionnaireComponent } from './release-questionnaire.component';

@NgModule({
    declarations: [
        ReleaseQuestionnaireComponent
    ],
    imports: [
        CommonModule,
        FormMessageDisplayModule,
        FormsModule,
        ReactiveFormsModule,
        MatCheckboxModule,
        MatDialogModule,
        MatFormFieldModule
    ],
    exports: [ReleaseQuestionnaireComponent]
})

export class ReleaseQuestionnaireModule {

}
