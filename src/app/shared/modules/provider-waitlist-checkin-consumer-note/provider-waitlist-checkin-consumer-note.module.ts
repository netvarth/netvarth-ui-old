import { NgModule } from '@angular/core';
import { ProviderWaitlistCheckInConsumerNoteComponent } from './provider-waitlist-checkin-consumer-note.component';
import { Nl2BrPipeModule } from 'nl2br-pipe';
import { SharedModule } from '../common/shared.module';
import { CapitalizeFirstPipeModule } from '../../pipes/capitalize.module';

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
