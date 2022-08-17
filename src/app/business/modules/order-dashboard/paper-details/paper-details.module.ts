import { NgModule,CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaperDetailsComponent } from './paper-details.component';
import { MatTabsModule } from '@angular/material/tabs';


@NgModule({
  declarations: [
    PaperDetailsComponent
  ],
  imports: [
    CommonModule,
    MatTabsModule
  ],
  exports:[
    PaperDetailsComponent
  ],
  schemas: [
      CUSTOM_ELEMENTS_SCHEMA,
      NO_ERRORS_SCHEMA
  ]
})
export class PaperDetailsModule { }
