import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsumerFaqComponent } from './consumer-faq.component';
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
    { path: '', component: ConsumerFaqComponent}
];
@NgModule({
    imports: [
        CommonModule,
        [RouterModule.forChild(routes)]
    ],
    declarations: [
        ConsumerFaqComponent
    ],
    exports: [ConsumerFaqComponent]
})
export class ConsumerFaqModule {}

