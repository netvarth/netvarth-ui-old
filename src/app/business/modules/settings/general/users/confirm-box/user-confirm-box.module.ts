import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { UserConfirmBoxComponent } from "./user-confirm-box.component";

@NgModule({
    imports: [
        CommonModule,
        MatDialogModule
    ],
    exports: [UserConfirmBoxComponent],
    declarations: [UserConfirmBoxComponent]
})
export class UserConfirmBoxModule {}