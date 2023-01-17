import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionaireViewComponent } from './questionaire-view.component';
import { LoadingSpinnerModule } from '../../modules/loading-spinner/loading-spinner.module';
import { CapitalizeFirstPipeModule } from '../../pipes/capitalize.module';
import { FileService } from '../../services/file-service';



@NgModule({
  declarations: [
    QuestionaireViewComponent
  ],
  imports: [
    CommonModule,
    LoadingSpinnerModule,
    CapitalizeFirstPipeModule
  ],
  exports: [
    QuestionaireViewComponent
  ],
  providers: [
    FileService
  ]
})
export class QuestionaireViewModule { }
