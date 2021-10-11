import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { AddInboxMessagesModule } from "../add-inbox-messages/add-inbox-messages.module";
import { CommunicationComponent } from "./communication.component";

@NgModule({
    imports:[
        MatDialogModule,
        CommonModule,
        AddInboxMessagesModule
    ],
    exports:[
        CommunicationComponent
    ],
    declarations: [
        CommunicationComponent
    ]
})
export class CommunicationModule {}