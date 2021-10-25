import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsumerLearnmoreComponent } from './consumer-learnmore.component';
import { HeaderModule } from '../../../shared/modules/header/header.module';
import { RouterModule, Routes } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
const routes: Routes = [
    { path: '', component: ConsumerLearnmoreComponent}
];
@NgModule({
    imports: [
        CommonModule,
        HeaderModule,
        MatExpansionModule,
        [RouterModule.forChild(routes)]
    ],
    declarations: [
        ConsumerLearnmoreComponent
    ],
    exports: [ConsumerLearnmoreComponent]
})
export class ConsumerLearnmoreModule {}
