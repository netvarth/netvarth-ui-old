import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PagerComponent } from './pager.component';

import { PagerService } from '../pager/pager.service';
@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        FormsModule
    ],
    declarations: [PagerComponent],
    exports: [PagerComponent],
    providers: [PagerService]
})

export class PagerModule {
}
