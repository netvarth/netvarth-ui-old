import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../common/material.module';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { LearnmoreComponent } from './learnmore.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        MaterialModule,
        ScrollToModule.forRoot()
    ],
    declarations: [
        LearnmoreComponent
    ],
    entryComponents: [
        LearnmoreComponent
    ],
    exports: [LearnmoreComponent]
})
export class LearnmoreModule {
}
