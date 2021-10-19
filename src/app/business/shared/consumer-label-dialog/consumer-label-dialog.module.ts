import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatListModule } from "@angular/material/list";
import { ConsumerLabelDialogComponent } from "./consumer-label-dialog.component";

@NgModule({
    declarations: [ConsumerLabelDialogComponent],
    exports: [ConsumerLabelDialogComponent],
    imports: [
        CommonModule,
        FormsModule,
        MatDialogModule,
        MatListModule,
        MatButtonModule
    ]
})
export class ConsumerLabelDialogModule{}