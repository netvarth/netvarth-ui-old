import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LoadingSpinnerModule } from '../../../../shared/modules/loading-spinner/loading-spinner.module';
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
        MatFormFieldModule,
        MatInputModule,
        LoadingSpinnerModule
    ],
    exports: [ReleaseQuestionnaireComponent]
})

export class ReleaseQuestionnaireModule {

}
