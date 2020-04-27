import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/modules/common/shared.module';
import { ProviderWaitlistCheckInConsumerNoteComponent } from './provider-waitlist-checkin-consumer-note.component';
import { CapitalizeFirstPipeModule } from '../../../../shared/pipes/capitalize.module';
import { Nl2BrPipeModule } from 'nl2br-pipe';

@NgModule({
    imports: [
        SharedModule,
        CapitalizeFirstPipeModule,
        Nl2BrPipeModule
    ],
    declarations: [
        ProviderWaitlistCheckInConsumerNoteComponent
    ],
    entryComponents: [
        ProviderWaitlistCheckInConsumerNoteComponent
    ],
    exports: [ProviderWaitlistCheckInConsumerNoteComponent]
})
export class ProviderWaitlistCheckInConsumerNoteModule { }
