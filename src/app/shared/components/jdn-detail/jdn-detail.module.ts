import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { JdnComponent } from "./jdn-detail-component";

@NgModule({
    imports: [
        MatDialogModule,
        CommonModule
    ],
    exports: [
        JdnComponent
    ],
    declarations: [
        JdnComponent
    ]
})
export class JDNDetailModule {}