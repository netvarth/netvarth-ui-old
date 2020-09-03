import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/modules/common/shared.module';
import { TeleServiceComponent } from './teleservice.component';
import { CapitalizeFirstPipeModule } from '../../../shared/pipes/capitalize.module';
import { TeleServiceRoutingModule } from './teleservice.routing.module';
import { TeleServiceConfirmBoxComponent } from './teleservice-confirm-box/teleservice-confirm-box.component';
import { TeleServiceShareComponent } from './teleservice-share/teleservice-share.component';

@NgModule({
    imports: [
        SharedModule,
        CapitalizeFirstPipeModule,
        TeleServiceRoutingModule
    ],
    declarations: [
        TeleServiceComponent,
        TeleServiceConfirmBoxComponent,
        TeleServiceShareComponent
    ],
    entryComponents: [
        TeleServiceComponent,
        TeleServiceConfirmBoxComponent,
        TeleServiceShareComponent
    ],
    exports: [TeleServiceComponent]
})
export class TeleServiceModule { }
