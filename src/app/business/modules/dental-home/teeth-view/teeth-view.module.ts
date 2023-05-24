import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatChipsModule } from '@angular/material/chips';
import { CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TeethViewComponent } from './teeth-view.component';
import { TabViewModule } from 'primeng/tabview';
import { MatTabsModule } from '@angular/material/tabs';

const routes: Routes = [
    { path: '', component: TeethViewComponent }
  ]
  

@NgModule({
  declarations: [
    TeethViewComponent
  ],
  imports: [
    CommonModule,
    MatChipsModule,
    FormsModule,
    ReactiveFormsModule,
    TabViewModule,
    MatTabsModule,
    [RouterModule.forChild(routes)]
  ],
  exports: [
    TeethViewComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class TeethViewModule { }
