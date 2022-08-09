import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { QuickActionsComponent } from "./quick-actions.component";

@NgModule({
    declarations: [
        QuickActionsComponent

    ],
    imports: [
        CommonModule
    ],
    exports: [
        QuickActionsComponent
    ]
})

export class QuickActionsModule {}