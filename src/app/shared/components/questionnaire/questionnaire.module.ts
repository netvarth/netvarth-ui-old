import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { HeaderModule } from '../../modules/header/header.module';
import { LoadingSpinnerModule } from '../../modules/loading-spinner/loading-spinner.module';
import { QuestionnaireComponent } from './questionnaire.component';
import { QuestionnaireRoutingModule } from './questionnaire.routing.module';
import { GalleryModule as ModalGalleryModule } from '@ks89/angular-modal-gallery';
import { CapitalizeFirstPipeModule } from '../../pipes/capitalize.module';

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
        LoadingSpinnerModule,
        MatOptionModule,
        MatSelectModule,
        ReactiveFormsModule,
        ModalGalleryModule.forRoot({ shortcuts: ['ctrl+s', 'meta+s'], disableSsrWorkaround: true }),
        CapitalizeFirstPipeModule
    ],
    exports: [QuestionnaireComponent]
})
export class QuestionnaireModule { }
