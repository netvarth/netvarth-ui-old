import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormMessageDisplayModule } from '../../../../shared/modules/form-message-display/form-message-display.module';
import { AddProviderWaitlistCheckInProviderNoteComponent } from './add-provider-waitlist-checkin-provider-note.component';

@NgModule({
    imports: [
        MatDialogModule,
        CommonModule,
        ReactiveFormsModule,
        FormMessageDisplayModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        MatMenuModule,
        MatTooltipModule
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
