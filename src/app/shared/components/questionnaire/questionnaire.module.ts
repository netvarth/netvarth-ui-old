import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { LoadingSpinnerModule } from '../../modules/loading-spinner/loading-spinner.module';
import { QuestionnaireComponent } from './questionnaire.component';
import { GalleryModule as ModalGalleryModule } from '@ks89/angular-modal-gallery';
import { CapitalizeFirstPipeModule } from '../../pipes/capitalize.module';
import { FileService } from '../../services/file-service';
@NgModule({
    declarations: [
        QuestionnaireComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        LoadingSpinnerModule,
        CapitalizeFirstPipeModule,
        ModalGalleryModule.forRoot({ shortcuts: ['ctrl+s', 'meta+s'], disableSsrWorkaround: true }),
        MatDatepickerModule,
        MatCheckboxModule,
        MatSlideToggleModule,
        MatOptionModule,
        MatSelectModule
    ],
    providers:[FileService],
    exports: [QuestionnaireComponent]
})
export class QuestionnaireModule { }
