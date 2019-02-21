import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../common/material.module';
import { BreadCrumbComponent } from './breadcrumb.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        MaterialModule
    ],
    declarations: [
        BreadCrumbComponent
    ],
    exports: [BreadCrumbComponent]
})
export class BreadCrumbModule {
}
