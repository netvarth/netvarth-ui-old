import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { ThirdpartypopupComponent } from "./thirdpartypopup.component";
import { MatFormFieldModule } from "@angular/material/form-field";
@NgModule({
    imports: [ CommonModule,
        MatDialogModule,
        MatFormFieldModule,
    ],
    exports: [ThirdpartypopupComponent],
    declarations: [ThirdpartypopupComponent]
})
export class ThirdpartypopupModule {}