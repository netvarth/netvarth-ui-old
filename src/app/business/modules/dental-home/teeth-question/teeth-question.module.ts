import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatChipsModule } from '@angular/material/chips';
import { CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import { TeethQuestionComponent } from './teeth-question.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabViewModule } from 'primeng/tabview';
import { InputTextModule } from 'primeng/inputtext';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CapitalizeFirstPipeModule } from '../../../../shared/pipes/capitalize.module';
import { LoadingSpinnerModule } from '../../../../../../src/app/shared/modules/loading-spinner/loading-spinner.module';

const routes: Routes = [
    { path: '', component: TeethQuestionComponent }
  ]
  

@NgModule({
  declarations: [
    TeethQuestionComponent
  ],
  imports: [
    CommonModule,
    MatChipsModule,
    FormsModule,
    ReactiveFormsModule,
    TabViewModule,
    CommonModule,
    MatInputModule,
    InputTextModule,
    MatRadioModule,
    MatCheckboxModule,
    CapitalizeFirstPipeModule,
    LoadingSpinnerModule,
    [RouterModule.forChild(routes)]
  ],
  exports: [
    TeethQuestionComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class TeethQuestionModule { }

