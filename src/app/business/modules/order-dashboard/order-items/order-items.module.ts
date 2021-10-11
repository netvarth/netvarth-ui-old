import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { CardModule } from "../../../../shared/components/card/card.module";
import { OrderItemsComponent } from "./order-items.component";

@NgModule({
    imports: [
        MatDialogModule,
        CommonModule,
        CardModule
    ],
    exports: [OrderItemsComponent],
    declarations: [
        OrderItemsComponent
    ]
})
export class OrderItemsModule {}