import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { RouterModule } from "@angular/router";
import { ShowMessageComponent } from "./show-messages.component";

@NgModule({
    imports: [
        RouterModule,
        CommonModule,
        MatDialogModule,
        MatButtonModule
    ],
    exports: [ShowMessageComponent],
    declarations: [
        ShowMessageComponent
    ]
})
export class ShowMessagesModule{}