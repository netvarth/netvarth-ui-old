import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatListModule } from "@angular/material/list";
import { ConsumerGroupDialogComponent } from "./consumer-group-dialog.component";

@NgModule({
    declarations: [ConsumerGroupDialogComponent],
    exports: [ConsumerGroupDialogComponent],
    imports: [
        CommonModule,
        MatDialogModule,
        MatListModule,
        FormsModule,
        MatButtonModule,
        FormsModule
    ]
})
export class ConsumerGroupDialogModule{}