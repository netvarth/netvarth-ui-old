import { NgModule } from '@angular/core';
import { JaldeeFilterComponent } from './jaldee-filter.component';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [CommonModule],
    declarations: [JaldeeFilterComponent],
    exports: [JaldeeFilterComponent]
})
export class JaldeeFilterModule {}
