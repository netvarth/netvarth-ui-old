import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/modules/common/shared.module';
import { AddProviderWaitlistCheckInProviderNoteComponent } from './add-provider-waitlist-checkin-provider-note.component';

@NgModule({
    imports: [
        SharedModule
    ],
    declarations: [
        AddProviderWaitlistCheckInProviderNoteComponent
    ],
    entryComponents: [
        AddProviderWaitlistCheckInProviderNoteComponent
    ],
    exports: [AddProviderWaitlistCheckInProviderNoteComponent]
})
export class AddProviderWaitlistCheckInProviderNoteModule { }
