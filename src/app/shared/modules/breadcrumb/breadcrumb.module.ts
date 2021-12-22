import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BreadCrumbComponent } from './breadcrumb.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule
    ],
    declarations: [
        BreadCrumbComponent
    ],
    exports: [BreadCrumbComponent]
})
export class BreadCrumbModule {
}
