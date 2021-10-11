import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { NotificationListBoxComponent } from "./notification-list-box.component";

@NgModule({
    imports: [
        MatDialogModule,
        CommonModule
    ],
    exports: [
        NotificationListBoxComponent
    ],
    declarations: [
        NotificationListBoxComponent
    ]
})
export class NotificationListBoxModule {}