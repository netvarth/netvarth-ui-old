import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/modules/common/shared.module';
import { TeleServiceComponent } from './teleservice.component';
import { CapitalizeFirstPipeModule } from '../../../shared/pipes/capitalize.module';
import { TeleServiceRoutingModule } from './teleservice.routing.module';

@NgModule({
    imports: [
        SharedModule,
        CapitalizeFirstPipeModule,
        TeleServiceRoutingModule
    ],
    declarations: [
        TeleServiceComponent
    ],
    entryComponents: [
        TeleServiceComponent
    ],
    exports: [TeleServiceComponent]
})
export class TeleServiceModule { }
