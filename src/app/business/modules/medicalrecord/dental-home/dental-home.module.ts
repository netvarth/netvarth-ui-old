import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DentalHomeComponent } from './dental-home.component';
import { RouterModule, Routes } from '@angular/router';
import { MatChipsModule } from '@angular/material/chips';
import { CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', component: DentalHomeComponent },
  { path: 'teeth/:id', loadChildren: () => import('./teeth-question/teeth-question.module').then(m => m.TeethQuestionModule) },
  { path: 'teeth/:id/view', loadChildren: () => import('./teeth-view/teeth-view.module').then(m => m.TeethViewModule) },
]

@NgModule({
  declarations: [
    DentalHomeComponent
  ],
  imports: [
    CommonModule,
    MatChipsModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    [RouterModule.forChild(routes)]
  ],
  exports: [
    DentalHomeComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class DentalHomeModule { }
