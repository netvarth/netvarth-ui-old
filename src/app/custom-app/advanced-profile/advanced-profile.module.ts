import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AdvancedProfileComponent } from "./advanced-profile.component";

@NgModule({
    declarations: [
        AdvancedProfileComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        AdvancedProfileComponent
    ]
})

export class AdvancedProfileModule {}