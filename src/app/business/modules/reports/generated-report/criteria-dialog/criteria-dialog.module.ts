import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { CriteriaDialogComponent } from "./criteria-dialog.component";

@NgModule({
    declarations: [CriteriaDialogComponent],
    exports: [CriteriaDialogComponent],
    imports: [
        CommonModule,
        MatDialogModule,
        FormsModule,
        MatButtonModule
    ]   
})
export class CriteriaDialogModule{}