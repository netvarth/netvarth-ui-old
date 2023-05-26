import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingsComponent } from './bookings.component';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table';
import { AccordionModule } from 'primeng/accordion';
import { SkeletonLoadingModule } from '../../../shared/modules/skeleton-loading/skeleton-loading.module';

@NgModule({
  declarations: [
    BookingsComponent
  ],
  imports: [
    CommonModule,
    CardModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    TooltipModule,
    TableModule,
    AccordionModule,
    SkeletonLoadingModule
  ],
  exports: [BookingsComponent]
})
export class BookingsModule {
}
