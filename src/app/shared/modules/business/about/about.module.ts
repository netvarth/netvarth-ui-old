import { NgModule } from '@angular/core';
import { OwlModule } from 'ngx-owl-carousel';
import { AboutComponent } from './about.component';
import { AboutRoutingModule } from './about.routing.module';
@NgModule({
    imports: [
        AboutRoutingModule,
        OwlModule
    ],
    declarations: [
        AboutComponent
    ],
    entryComponents: [],
    exports: [AboutComponent]
})
export class AboutModule { }
