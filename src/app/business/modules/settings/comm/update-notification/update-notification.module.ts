import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { UpdateNotificationComponent } from "./update-notification.component";

@NgModule({
    imports: [
        MatDialogModule,
        MatInputModule,
        MatFormFieldModule,
        MatSlideToggleModule,
        FormsModule,
        CommonModule
    ],
    exports: [UpdateNotificationComponent],
    declarations: [UpdateNotificationComponent]
})
export class UpdateNotificationModule {}