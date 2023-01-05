import { NgModule } from '@angular/core';
import { ProviderWaitlistCheckInConsumerNoteComponent } from './provider-waitlist-checkin-consumer-note.component';
import { Nl2BrPipeModule } from 'nl2br-pipe';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
    imports: [
        Nl2BrPipeModule,
        CommonModule,
        MatDialogModule,
        Nl2BrPipeModule
    ],
    declarations: [
        ProviderWaitlistCheckInConsumerNoteComponent
    ],
    exports: [ProviderWaitlistCheckInConsumerNoteComponent]
})
export class ProviderWaitlistCheckInConsumerNoteModule { }
