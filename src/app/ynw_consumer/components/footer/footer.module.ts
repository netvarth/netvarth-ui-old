import { NgModule } from '@angular/core';
import { ConsumerFooterComponent } from './footer.component';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule],
    declarations: [ConsumerFooterComponent],
    exports: [ConsumerFooterComponent]
})
export class ConsumerFooterModule {}
