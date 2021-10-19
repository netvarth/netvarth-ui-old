import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { Nl2BrPipeModule } from "nl2br-pipe";
import { CapitalizeFirstPipeModule } from "../../../../shared/pipes/capitalize.module";
import { AddInboxMessagesModule } from "../../../../shared/components/add-inbox-messages/add-inbox-messages.module";
import { InboxListComponent } from "./inbox-list.component";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatDialogModule } from "@angular/material/dialog";
import { InboxServices } from "../inbox.service";

@NgModule({
    declarations: [InboxListComponent],
    exports: [InboxListComponent],
    imports: [
        CommonModule,
        AddInboxMessagesModule,
        Nl2BrPipeModule,
        CapitalizeFirstPipeModule,
        MatTooltipModule,
        MatDialogModule
    ],
    providers: [
        InboxServices
    ]
})
export class InboxListModule{}
