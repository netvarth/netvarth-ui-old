import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { ThirdpartypopupComponent } from "./thirdpartypopup.component";
@NgModule({
    imports: [ CommonModule,
        MatDialogModule
    ],
    exports: [ThirdpartypopupComponent],
    declarations: [ThirdpartypopupComponent]
})
export class ThirdpartypopupModule {}