import { NgModule } from '@angular/core';
import { DisplayboardMgrComponent } from './displayboardmgr.component';
import { DisplayboardRoutingModule } from './displayboard.routing.module';
import { BreadCrumbModule } from '../../../shared/modules/breadcrumb/breadcrumb.module';

@NgModule({
    declarations: [
       DisplayboardMgrComponent
    ],
    imports: [
        DisplayboardRoutingModule,
        BreadCrumbModule
    ],
    exports: [DisplayboardMgrComponent]
})
export class DisplayboardModule {}
