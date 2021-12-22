import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatListModule } from "@angular/material/list";
import { LoadingSpinnerModule } from "../../../shared/modules/loading-spinner/loading-spinner.module";
import { UsersListDialogComponent } from "./users-list-dialog.component";

@NgModule({
    declarations: [UsersListDialogComponent],
    exports: [UsersListDialogComponent],
    imports: [
        CommonModule,
        FormsModule,
        MatDialogModule,
        MatListModule,
        MatButtonModule,
        LoadingSpinnerModule
    ]
})
export class UsersListDialogModule{}