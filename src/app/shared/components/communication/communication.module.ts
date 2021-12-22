import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { CommunicationService } from "../../../business/services/communication-service";
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
    ],
    providers: [
        CommunicationService
    ]
})
export class CommunicationModule {}