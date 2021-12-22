import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { LoadingSpinnerModule } from "../../loading-spinner/loading-spinner.module";
import { UserlistpopupComponent } from "./userlistpopup.component";

@NgModule({
    imports: [
        CommonModule,
        MatDialogModule,
        LoadingSpinnerModule
    ],
    exports: [UserlistpopupComponent],
    declarations: [UserlistpopupComponent]
})
export class UserlistpopupModule {}