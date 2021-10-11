import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { RequestDialogComponent } from "./request-dialog.component";

@NgModule({
    imports: [
        MatDialogModule,
        CommonModule
    ],
    declarations: [RequestDialogComponent],
    exports: [RequestDialogComponent]
})
export class RequestDialogModule {}